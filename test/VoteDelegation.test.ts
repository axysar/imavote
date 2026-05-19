import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { VoteDelegation } from "../typechain-types";

describe("VoteDelegation", () => {
  let delegation: VoteDelegation;
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;

  beforeEach(async () => {
    [owner, alice, bob, charlie] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VoteDelegation");
    delegation = (await Factory.deploy()) as unknown as VoteDelegation;
    await delegation.waitForDeployment();
  });

  describe("Delegation", () => {
    it("sets a delegate and updates weight", async () => {
      await expect(delegation.connect(alice).setDelegate(bob.address))
        .to.emit(delegation, "DelegateSet")
        .withArgs(alice.address, bob.address);

      expect(await delegation.getDelegate(alice.address)).to.equal(bob.address);
      expect(await delegation.getWeight(bob.address)).to.equal(1);
    });

    it("prevents self-delegation", async () => {
      await expect(
        delegation.connect(alice).setDelegate(alice.address),
      ).to.be.revertedWithCustomError(delegation, "CannotDelegateToSelf");
    });

    it("prevents duplicate delegation to same address", async () => {
      await delegation.connect(alice).setDelegate(bob.address);
      await expect(
        delegation.connect(alice).setDelegate(bob.address),
      ).to.be.revertedWithCustomError(delegation, "AlreadyDelegatedTo");
    });

    it("switching delegates updates weight correctly", async () => {
      await delegation.connect(alice).setDelegate(bob.address);
      expect(await delegation.getWeight(bob.address)).to.equal(1);

      await delegation.connect(alice).setDelegate(charlie.address);
      expect(await delegation.getWeight(bob.address)).to.equal(0);
      expect(await delegation.getWeight(charlie.address)).to.equal(1);
    });

    it("multiple delegators accumulate weight", async () => {
      await delegation.connect(alice).setDelegate(charlie.address);
      await delegation.connect(bob).setDelegate(charlie.address);
      expect(await delegation.getWeight(charlie.address)).to.equal(2);
    });

    it("removes delegation and decrements weight", async () => {
      await delegation.connect(alice).setDelegate(bob.address);
      await expect(delegation.connect(alice).removeDelegate())
        .to.emit(delegation, "DelegateRemoved")
        .withArgs(alice.address, bob.address);

      expect(await delegation.getDelegate(alice.address)).to.equal(
        ethers.ZeroAddress,
      );
      expect(await delegation.getWeight(bob.address)).to.equal(0);
    });

    it("revert when removing non-existent delegation", async () => {
      await expect(
        delegation.connect(alice).removeDelegate(),
      ).to.be.revertedWithCustomError(delegation, "NoDelegationSet");
    });
  });

  describe("Profiles", () => {
    it("sets and reads a delegate profile", async () => {
      await expect(
        delegation.connect(bob).setProfile("ipfs://QmTest123"),
      )
        .to.emit(delegation, "DelegateProfileUpdated")
        .withArgs(bob.address, "ipfs://QmTest123");

      expect(await delegation.getProfile(bob.address)).to.equal(
        "ipfs://QmTest123",
      );
    });

    it("returns empty string for unset profiles", async () => {
      expect(await delegation.getProfile(alice.address)).to.equal("");
    });
  });
});
