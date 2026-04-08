import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import type { VoterRegistry } from "../typechain-types";

describe("VoterRegistry", () => {
  let registry: VoterRegistry;
  let owner: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let outsider: SignerWithAddress;

  beforeEach(async () => {
    [owner, voter1, voter2, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VoterRegistry");
    registry = (await Factory.deploy()) as unknown as VoterRegistry;
    await registry.waitForDeployment();
  });

  it("owner can add a voter", async () => {
    await expect(registry.addVoter(voter1.address))
      .to.emit(registry, "VoterAdded")
      .withArgs(voter1.address);
    expect(await registry.isRegistered(voter1.address)).to.equal(true);
    expect(await registry.getVoterCount()).to.equal(1);
  });

  it("prevents duplicates", async () => {
    await registry.addVoter(voter1.address);
    await expect(registry.addVoter(voter1.address)).to.be.revertedWith(
      "VoterRegistry: already registered",
    );
  });

  it("non-owner cannot add voters", async () => {
    await expect(registry.connect(outsider).addVoter(voter1.address)).to.be
      .reverted;
  });

  it("owner can remove a voter", async () => {
    await registry.addVoter(voter1.address);
    await expect(registry.removeVoter(voter1.address))
      .to.emit(registry, "VoterRemoved")
      .withArgs(voter1.address);
    expect(await registry.isRegistered(voter1.address)).to.equal(false);
  });

  it("enumerates voters by index", async () => {
    await registry.addVoter(voter1.address);
    await registry.addVoter(voter2.address);
    expect(await registry.getVoterAt(0)).to.equal(voter1.address);
    expect(await registry.getVoterAt(1)).to.equal(voter2.address);
  });

  it("rejects out-of-bounds access", async () => {
    await expect(registry.getVoterAt(0)).to.be.revertedWith(
      "VoterRegistry: out of bounds",
    );
  });
});
