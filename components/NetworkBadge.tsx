"use client";

import { useChainId, useAccount } from "wagmi";
import { getChainMeta } from "@/lib/chains";
import { Badge } from "./ui/Badge";

export function NetworkBadge() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) return null;

  const meta = getChainMeta(chainId);

  return (
    <Badge
      variant={meta.isTestnet ? "warning" : "success"}
      dot
      className="text-[10px]"
    >
      {meta.shortName}
    </Badge>
  );
}
