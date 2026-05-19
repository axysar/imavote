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
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY ?? "";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY ?? "";

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

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
    // --- Testnets ---
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts,
    },
    arbitrumSepolia: {
      url: ALCHEMY_KEY
        ? `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts,
    },
    baseSepolia: {
      url: ALCHEMY_KEY
        ? `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://sepolia.base.org",
      chainId: 84532,
      accounts,
    },
    // --- Mainnets ---
    mainnet: {
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://cloudflare-eth.com",
      chainId: 1,
      accounts,
    },
    arbitrum: {
      url: ALCHEMY_KEY
        ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts,
    },
    base: {
      url: ALCHEMY_KEY
        ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://mainnet.base.org",
      chainId: 8453,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      arbitrumSepolia: ARBISCAN_API_KEY,
      base: BASESCAN_API_KEY,
      baseSepolia: BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
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
