import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("Voting contract deployed to:", address);

  // Add initial candidates for testing
  await voting.addCandidate("Alice Johnson");
  await voting.addCandidate("Bob Smith");
  await voting.addCandidate("Charlie Davis");
  console.log("Initial candidates registered:", await voting.candidateCount());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
