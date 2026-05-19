/**
 * Chain metadata for block explorers, display names, and contract addresses.
 * This is the single source of truth the frontend uses for multi-chain awareness.
 */

export interface ChainMeta {
  name: string;
  shortName: string;
  explorerUrl: string;
  explorerName: string;
  isTestnet: boolean;
}

export const CHAIN_META: Record<number, ChainMeta> = {
  1: {
    name: "Ethereum Mainnet",
    shortName: "Ethereum",
    explorerUrl: "https://etherscan.io",
    explorerName: "Etherscan",
    isTestnet: false,
  },
  11155111: {
    name: "Sepolia Testnet",
    shortName: "Sepolia",
    explorerUrl: "https://sepolia.etherscan.io",
    explorerName: "Etherscan",
    isTestnet: true,
  },
  42161: {
    name: "Arbitrum One",
    shortName: "Arbitrum",
    explorerUrl: "https://arbiscan.io",
    explorerName: "Arbiscan",
    isTestnet: false,
  },
  421614: {
    name: "Arbitrum Sepolia",
    shortName: "Arb Sepolia",
    explorerUrl: "https://sepolia.arbiscan.io",
    explorerName: "Arbiscan",
    isTestnet: true,
  },
  8453: {
    name: "Base",
    shortName: "Base",
    explorerUrl: "https://basescan.org",
    explorerName: "BaseScan",
    isTestnet: false,
  },
  84532: {
    name: "Base Sepolia",
    shortName: "Base Sepolia",
    explorerUrl: "https://sepolia.basescan.org",
    explorerName: "BaseScan",
    isTestnet: true,
  },
  31337: {
    name: "Hardhat Local",
    shortName: "Hardhat",
    explorerUrl: "",
    explorerName: "Local",
    isTestnet: true,
  },
};

export function getChainMeta(chainId: number): ChainMeta {
  return (
    CHAIN_META[chainId] ?? {
      name: `Chain ${chainId}`,
      shortName: `#${chainId}`,
      explorerUrl: "",
      explorerName: "Unknown",
      isTestnet: false,
    }
  );
}

export function getExplorerTxUrl(chainId: number, hash: string): string {
  const meta = getChainMeta(chainId);
  if (!meta.explorerUrl) return "";
  return `${meta.explorerUrl}/tx/${hash}`;
}

export function getExplorerAddressUrl(
  chainId: number,
  address: string,
): string {
  const meta = getChainMeta(chainId);
  if (!meta.explorerUrl) return "";
  return `${meta.explorerUrl}/address/${address}`;
}
