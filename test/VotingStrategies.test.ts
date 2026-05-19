import { expect } from "chai";
import { ethers } from "hardhat";
import type { VotingStrategies } from "../typechain-types";

describe("VotingStrategies", () => {
  let strategies: VotingStrategies;

  beforeEach(async () => {
    const Factory = await ethers.getContractFactory("VotingStrategies");
    strategies = (await Factory.deploy()) as unknown as VotingStrategies;
    await strategies.waitForDeployment();
  });

  describe("equalWeight", () => {
    it("returns 1 for any address", async () => {
      const [a, b] = await ethers.getSigners();
      expect(await strategies.equalWeight(a.address)).to.equal(1);
      expect(await strategies.equalWeight(b.address)).to.equal(1);
    });
  });

  describe("fixedWeight", () => {
    it("returns the provided weight", async () => {
      const [a] = await ethers.getSigners();
      expect(await strategies.fixedWeight(a.address, 42)).to.equal(42);
      expect(await strategies.fixedWeight(a.address, 0)).to.equal(0);
    });
  });

  describe("quadraticWeight", () => {
    it("returns sqrt of input", async () => {
      expect(await strategies.quadraticWeight(0)).to.equal(0);
      expect(await strategies.quadraticWeight(1)).to.equal(1);
      expect(await strategies.quadraticWeight(4)).to.equal(2);
      expect(await strategies.quadraticWeight(9)).to.equal(3);
      expect(await strategies.quadraticWeight(100)).to.equal(10);
      expect(await strategies.quadraticWeight(10000)).to.equal(100);
    });

    it("floors non-perfect squares", async () => {
      expect(await strategies.quadraticWeight(2)).to.equal(1);
      expect(await strategies.quadraticWeight(3)).to.equal(1);
      expect(await strategies.quadraticWeight(5)).to.equal(2);
      expect(await strategies.quadraticWeight(8)).to.equal(2);
      expect(await strategies.quadraticWeight(99)).to.equal(9);
    });
  });

  describe("cappedWeight", () => {
    it("returns rawWeight when below cap", async () => {
      expect(await strategies.cappedWeight(5, 10)).to.equal(5);
    });

    it("returns cap when rawWeight exceeds it", async () => {
      expect(await strategies.cappedWeight(100, 10)).to.equal(10);
    });

    it("returns cap when equal", async () => {
      expect(await strategies.cappedWeight(10, 10)).to.equal(10);
    });

    it("handles zero", async () => {
      expect(await strategies.cappedWeight(0, 10)).to.equal(0);
      expect(await strategies.cappedWeight(5, 0)).to.equal(0);
    });
  });
});
