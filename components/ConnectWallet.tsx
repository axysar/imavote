"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { truncateAddress } from "@/lib/utils";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm hover:bg-zinc-800 transition-colors"
        >
          <span
            className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
            aria-hidden="true"
          />
          <span className="font-mono">{truncateAddress(address)}</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 p-2 animate-fade-in"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-xs text-zinc-500">Connected</p>
                <p className="text-sm font-mono truncate">{address}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Chain ID: {chainId}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  disconnect();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Prefer the injected connector (MetaMask, Rabby, etc.); fall back to the first.
  const connector =
    connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => connector && connect({ connector })}
      isLoading={isPending}
      loadingText="Connecting…"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
