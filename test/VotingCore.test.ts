import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { VotingCore } from "../typechain-types";

describe("VotingCore", () => {
  let votingCore: VotingCore;
  let admin: SignerWithAddress;
  let registrar: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let voter3: SignerWithAddress;
  let outsider: SignerWithAddress;

  const YES = 0;
  const NO = 1;
  const ABSTAIN = 2;

  beforeEach(async () => {
    [admin, registrar, voter1, voter2, voter3, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VotingCore");
    votingCore = (await Factory.deploy()) as unknown as VotingCore;
    await votingCore.waitForDeployment();

    const REGISTRAR_ROLE = await votingCore.REGISTRAR_ROLE();
    await votingCore.grantRole(REGISTRAR_ROLE, registrar.address);
  });

  // -------------------------------------------------------------------------
  // Voter Registration
  // -------------------------------------------------------------------------
  describe("Voter Registration", () => {
    it("registrar can register a voter", async () => {
      await expect(votingCore.connect(registrar).registerVoter(voter1.address))
        .to.emit(votingCore, "VoterRegistered")
        .withArgs(voter1.address);

      expect(await votingCore.isVoterRegistered(voter1.address)).to.equal(true);
      expect(await votingCore.totalRegisteredVoters()).to.equal(1);
    });

    it("prevents duplicate registration via custom error", async () => {
      await votingCore.connect(registrar).registerVoter(voter1.address);
      await expect(votingCore.connect(registrar).registerVoter(voter1.address))
        .to.be.revertedWithCustomError(votingCore, "AlreadyRegistered")
        .withArgs(voter1.address);
    });

    it("rejects unauthorized registration attempts", async () => {
      await expect(
        votingCore.connect(outsider).registerVoter(voter1.address),
      ).to.be.revertedWithCustomError(votingCore, "AccessControlUnauthorizedAccount");
    });

    it("batch registers multiple voters and is idempotent", async () => {
      await votingCore
        .connect(registrar)
        .batchRegisterVoters([voter1.address, voter2.address, voter3.address]);
      expect(await votingCore.totalRegisteredVoters()).to.equal(3);

      // Re-running should be a silent no-op for already-registered entries.
      await votingCore
        .connect(registrar)
        .batchRegisterVoters([voter1.address, outsider.address]);
      expect(await votingCore.totalRegisteredVoters()).to.equal(4);
    });

    it("deregisters a voter and decrements the total", async () => {
      await votingCore.connect(registrar).registerVoter(voter1.address);
      await votingCore.connect(registrar).deregisterVoter(voter1.address);
      expect(await votingCore.isVoterRegistered(voter1.address)).to.equal(false);
      expect(await votingCore.totalRegisteredVoters()).to.equal(0);
    });

    it("cannot deregister a non-registered voter", async () => {
      await expect(votingCore.connect(registrar).deregisterVoter(voter1.address))
        .to.be.revertedWithCustomError(votingCore, "NotRegistered")
        .withArgs(voter1.address);
    });
  });

  // -------------------------------------------------------------------------
  // Proposal Lifecycle
  // -------------------------------------------------------------------------
  describe("Proposal Lifecycle", () => {
    it("creates proposals with incrementing IDs and emits events", async () => {
      const tx = await votingCore.createProposal("Budget", "desc", 0);
      await expect(tx)
        .to.emit(votingCore, "ProposalCreated")
        .withArgs(1, "Budget", admin.address, 0);
      expect(await votingCore.proposalCount()).to.equal(1);

      await votingCore.createProposal("Upgrade", "desc 2", 0);
      expect(await votingCore.proposalCount()).to.equal(2);
    });

    it("rejects empty titles", async () => {
      await expect(
        votingCore.createProposal("", "desc", 0),
      ).to.be.revertedWithCustomError(votingCore, "EmptyTitle");
    });

    it("rejects deadlines in the past", async () => {
      const past = (await time.latest()) - 10;
      await expect(
        votingCore.createProposal("X", "Y", past),
      ).to.be.revertedWithCustomError(votingCore, "DeadlineInPast");
    });

    it("walks Pending → Active → Closed", async () => {
      await votingCore.createProposal("P", "d", 0);
      let p = await votingCore.proposals(1);
      expect(p.state).to.equal(0); // Pending

      await votingCore.activateProposal(1);
      p = await votingCore.proposals(1);
      expect(p.state).to.equal(1); // Active
      expect(p.activatedAt).to.be.gt(0);

      await votingCore.closeProposal(1);
      p = await votingCore.proposals(1);
      expect(p.state).to.equal(2); // Closed
      expect(p.closedAt).to.be.gt(0);
    });

    it("rejects activation on invalid state", async () => {
      await votingCore.createProposal("P", "d", 0);
      await votingCore.activateProposal(1);
      await expect(votingCore.activateProposal(1)).to.be.revertedWithCustomError(
        votingCore,
        "WrongState",
      );
    });

    it("rejects activation of non-existent proposal", async () => {
      await expect(votingCore.activateProposal(99)).to.be.revertedWithCustomError(
        votingCore,
        "InvalidProposalId",
      );
    });
  });

  // -------------------------------------------------------------------------
  // Vote Casting
  // -------------------------------------------------------------------------
  describe("Vote Casting", () => {
    beforeEach(async () => {
      await votingCore.connect(registrar).registerVoter(voter1.address);
      await votingCore.connect(registrar).registerVoter(voter2.address);
      await votingCore.connect(registrar).registerVoter(voter3.address);
      await votingCore.createProposal("Test", "Desc", 0);
      await votingCore.activateProposal(1);
    });

    it("accepts Yes/No/Abstain votes", async () => {
      await votingCore.connect(voter1).castVote(1, YES);
      await votingCore.connect(voter2).castVote(1, NO);
      await votingCore.connect(voter3).castVote(1, ABSTAIN);

      const p = await votingCore.proposals(1);
      expect(p.yesVotes).to.equal(1);
      expect(p.noVotes).to.equal(1);
      expect(p.abstainVotes).to.equal(1);
      expect(await votingCore.totalVotesOnProposal(1)).to.equal(3);
    });

    it("emits VoteCast event", async () => {
      await expect(votingCore.connect(voter1).castVote(1, YES))
        .to.emit(votingCore, "VoteCast")
        .withArgs(voter1.address, 1, YES);
    });

    it("prevents double voting", async () => {
      await votingCore.connect(voter1).castVote(1, YES);
      await expect(votingCore.connect(voter1).castVote(1, NO))
        .to.be.revertedWithCustomError(votingCore, "AlreadyVoted")
        .withArgs(voter1.address, 1);
    });

    it("rejects unregistered voters", async () => {
      await expect(votingCore.connect(outsider).castVote(1, YES))
        .to.be.revertedWithCustomError(votingCore, "NotRegistered")
        .withArgs(outsider.address);
    });

    it("rejects invalid selection values", async () => {
      await expect(votingCore.connect(voter1).castVote(1, 7))
        .to.be.revertedWithCustomError(votingCore, "InvalidSelection")
        .withArgs(7);
    });

    it("rejects voting on non-active proposals", async () => {
      await votingCore.createProposal("Pending", "x", 0);
      await expect(
        votingCore.connect(voter1).castVote(2, YES),
      ).to.be.revertedWithCustomError(votingCore, "WrongState");
    });

    it("respects voting deadline", async () => {
      const deadline = (await time.latest()) + 3600;
      await votingCore.createProposal("Timed", "Expires", deadline);
      await votingCore.activateProposal(2);

      await votingCore.connect(voter1).castVote(2, YES);

      await time.increaseTo(deadline + 1);
      await expect(
        votingCore.connect(voter2).castVote(2, YES),
      ).to.be.revertedWithCustomError(votingCore, "DeadlinePassed");
    });

    it("tracks hasVoted correctly", async () => {
      expect(await votingCore.hasVoted(voter1.address, 1)).to.equal(false);
      await votingCore.connect(voter1).castVote(1, YES);
      expect(await votingCore.hasVoted(voter1.address, 1)).to.equal(true);
    });
  });

  // -------------------------------------------------------------------------
  // Participation & Pagination
  // -------------------------------------------------------------------------
  describe("Views", () => {
    it("computes participation rate in basis points", async () => {
      await votingCore.connect(registrar).registerVoter(voter1.address);
      await votingCore.connect(registrar).registerVoter(voter2.address);
      await votingCore.createProposal("X", "Y", 0);
      await votingCore.activateProposal(1);

      expect(await votingCore.getParticipationRate(1)).to.equal(0);
      await votingCore.connect(voter1).castVote(1, YES);
      // 1 of 2 voters -> 5000 bps (50%)
      expect(await votingCore.getParticipationRate(1)).to.equal(5000);
    });

    it("returns a paginated slice of proposals", async () => {
      for (let i = 0; i < 5; i++) {
        await votingCore.createProposal(`Proposal ${i}`, "Body", 0);
      }

      const firstTwo = await votingCore.getProposals(1, 2);
      expect(firstTwo.length).to.equal(2);
      expect(firstTwo[0].id).to.equal(1);
      expect(firstTwo[1].id).to.equal(2);

      const lastTwo = await votingCore.getProposals(4, 10);
      expect(lastTwo.length).to.equal(2);
      expect(lastTwo[0].id).to.equal(4);
      expect(lastTwo[1].id).to.equal(5);

      const empty = await votingCore.getProposals(100, 10);
      expect(empty.length).to.equal(0);
    });
  });

  // -------------------------------------------------------------------------
  // Emergency Controls
  // -------------------------------------------------------------------------
  describe("Emergency Controls", () => {
    it("pauses and unpauses voting", async () => {
      await votingCore.connect(registrar).registerVoter(voter1.address);
      await votingCore.createProposal("T", "d", 0);
      await votingCore.activateProposal(1);

      await votingCore.pause();
      await expect(
        votingCore.connect(voter1).castVote(1, YES),
      ).to.be.revertedWithCustomError(votingCore, "EnforcedPause");

      await votingCore.unpause();
      await votingCore.connect(voter1).castVote(1, YES);

      const p = await votingCore.proposals(1);
      expect(p.yesVotes).to.equal(1);
    });

    it("only admin can pause", async () => {
      await expect(votingCore.connect(outsider).pause()).to.be.revertedWithCustomError(
        votingCore,
        "AccessControlUnauthorizedAccount",
      );
    });
  });
});
