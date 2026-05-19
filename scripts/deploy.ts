import { ethers, network, run } from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Deploy the VotingCore contract and (optionally) bootstrap it with a seed
 * proposal + initial voters. Writes the deployment metadata to
 * `deployments/<network>.json` so the frontend can pick up the address
 * automatically at build time.
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);

  console.log("======================================");
  console.log(" iMaVote :: VotingCore Deployment");
  console.log("======================================");
  console.log(" Network  :", network.name);
  console.log(" Deployer :", deployer.address);
  console.log(" Balance  :", ethers.formatEther(balance), "ETH");
  console.log("--------------------------------------");

  const Factory = await ethers.getContractFactory("VotingCore");
  const votingCore = await Factory.deploy();
  await votingCore.waitForDeployment();
  const address = await votingCore.getAddress();

  console.log(" VotingCore deployed at:", address);

  // Seed a demo proposal on local networks so developers immediately have
  // data on the dashboard without having to use the admin panel first.
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("--------------------------------------");
    console.log(" Seeding local demo data ...");

    const now = Math.floor(Date.now() / 1000);
    const oneWeek = 7 * 24 * 60 * 60;

    const tx1 = await votingCore.createProposal(
      "Treasury Allocation Q2",
      "Allocate 500 ETH from the treasury for ecosystem grants, " +
        "audits and public goods funding.",
      now + oneWeek,
    );
    await tx1.wait();

    const tx2 = await votingCore.createProposal(
      "Protocol Upgrade v2.0",
      "Approve the migration to the new VotingCore v2 contract with " +
        "commit-reveal voting and gas-optimized storage.",
      0, // no deadline
    );
    await tx2.wait();

    const tx3 = await votingCore.activateProposal(1n);
    await tx3.wait();

    // Register the deployer and a few well-known Hardhat accounts so the
    // local UI has something to vote with.
    const signers = await ethers.getSigners();
    for (const signer of signers.slice(0, 5)) {
      const already = await votingCore.isVoterRegistered(signer.address);
      if (!already) {
        const rx = await votingCore.registerVoter(signer.address);
        await rx.wait();
      }
    }
    console.log(" Seeded 2 proposals (#1 active) and 5 voters.");
  }

  // Deploy VoteDelegation contract
  console.log("--------------------------------------");
  const DelegationFactory = await ethers.getContractFactory("VoteDelegation");
  const delegation = await DelegationFactory.deploy();
  await delegation.waitForDeployment();
  const delegationAddr = await delegation.getAddress();
  console.log(" VoteDelegation deployed at:", delegationAddr);

  // Persist deployment metadata so the frontend & scripts can read it.
  const deploymentsDir = join(__dirname, "..", "deployments");
  if (!existsSync(deploymentsDir)) mkdirSync(deploymentsDir, { recursive: true });
  const payload = {
    contracts: {
      VotingCore: address,
      VoteDelegation: delegationAddr,
    },
    network: network.name,
    chainId: Number((await deployer.provider.getNetwork()).chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(
    join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(payload, null, 2),
  );
  console.log("--------------------------------------");
  console.log(" Deployment manifest written to:");
  console.log(" deployments/" + network.name + ".json");

  // Attempt Etherscan verification on public networks.
  if (network.name !== "hardhat" && network.name !== "localhost") {
    try {
      console.log(" Waiting for 5 confirmations before verification ...");
      await votingCore.deploymentTransaction()?.wait(5);
      await run("verify:verify", { address, constructorArguments: [] });
      console.log(" Etherscan verification complete.");
    } catch (err) {
      console.warn(" Verification skipped:", (err as Error).message);
    }
  }

  console.log("======================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
