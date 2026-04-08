import { createConfig, http } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";

const sepoliaRpc = alchemyKey
  ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
  : "https://rpc.sepolia.org";

const mainnetRpc = alchemyKey
  ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
  : "https://cloudflare-eth.com";

export const wagmiConfig = createConfig({
  chains: [sepolia, hardhat, mainnet],
  // App Router needs ssr: true to avoid hydration mismatches.
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
    [sepolia.id]: http(sepoliaRpc),
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [mainnet.id]: http(mainnetRpc),
  },
});
