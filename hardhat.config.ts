import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// IMPORTANT: Hardhat requires a Hardhat-specific tsconfig (CommonJS) because
// the frontend tsconfig targets ESM / bundler. The npm scripts set
// `TS_NODE_PROJECT=tsconfig.hardhat.json` before invoking Hardhat.

dotenv.config({ path: ".env.local" });
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
