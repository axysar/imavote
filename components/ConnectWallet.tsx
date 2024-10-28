"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/Button";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-white/10 text-sm font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect Wallet
    </Button>
  );
}
