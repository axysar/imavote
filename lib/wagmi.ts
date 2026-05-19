import { createConfig, http } from "wagmi";
import {
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  hardhat,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";

function alchemyRpc(network: string) {
  return alchemyKey
    ? `https://${network}.g.alchemy.com/v2/${alchemyKey}`
    : undefined;
}

export const wagmiConfig = createConfig({
  chains: [sepolia, arbitrumSepolia, baseSepolia, arbitrum, base, mainnet, hardhat],
  ssr: true,
  connectors: [
    injected({ shimDisconnect: true }),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
            metadata: {
              name: "iMaVote",
              description: "Decentralized voting on Ethereum",
              url: "https://imavote.xyz",
              icons: [],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [sepolia.id]: http(alchemyRpc("eth-sepolia") ?? "https://rpc.sepolia.org"),
    [arbitrumSepolia.id]: http(
      alchemyRpc("arb-sepolia") ?? "https://sepolia-rollup.arbitrum.io/rpc",
    ),
    [baseSepolia.id]: http(
      alchemyRpc("base-sepolia") ?? "https://sepolia.base.org",
    ),
    [arbitrum.id]: http(
      alchemyRpc("arb-mainnet") ?? "https://arb1.arbitrum.io/rpc",
    ),
    [base.id]: http(alchemyRpc("base-mainnet") ?? "https://mainnet.base.org"),
    [mainnet.id]: http(
      alchemyRpc("eth-mainnet") ?? "https://cloudflare-eth.com",
    ),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});
