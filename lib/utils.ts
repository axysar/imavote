import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProposalState } from "./contracts";

/** Merge Tailwind classes with proper precedence. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shorten an EVM address to `0x1234…abcd`. */
export function truncateAddress(address: string | undefined, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Humanize large numbers with K/M suffixes. */
export function formatVoteCount(count: number | bigint): string {
  const n = typeof count === "bigint" ? Number(count) : count;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getProposalStateLabel(state: number): string {
  switch (state) {
    case ProposalState.Pending:
      return "Pending";
    case ProposalState.Active:
      return "Active";
    case ProposalState.Closed:
      return "Closed";
    default:
      return "Unknown";
  }
}

export function getProposalStateBadgeVariant(
  state: number,
): "success" | "warning" | "danger" | "default" {
  switch (state) {
    case ProposalState.Active:
      return "success";
    case ProposalState.Pending:
      return "warning";
    case ProposalState.Closed:
      return "danger";
    default:
      return "default";
  }
}

/** `4m ago`, `in 2h`, `just now` — tiny relative-time helper. */
export function formatRelativeTime(unixSeconds: bigint | number): string {
  const ts = typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  if (!ts) return "—";
  const now = Math.floor(Date.now() / 1000);
  const diff = ts - now;
  const abs = Math.abs(diff);

  const units: Array<[number, string]> = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.35, "w"],
    [12, "mo"],
  ];

  let value = abs;
  let label = "s";
  for (const [step, next] of units) {
    if (value < step) break;
    value /= step;
    label = next;
  }

  const rounded = Math.max(1, Math.round(value));
  if (diff > 0) return `in ${rounded}${label}`;
  if (diff < 0) return `${rounded}${label} ago`;
  return "just now";
}

/** Format a deadline like `Apr 8, 2026 · 14:30`. */
export function formatTimestamp(unixSeconds: bigint | number | undefined): string {
  if (!unixSeconds) return "—";
  const ts = typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  return new Date(ts * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Basic EVM address validator. */
export function isValidAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

/** Safely divide two numbers and return a percentage (0-100). */
export function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.min(100, Math.max(0, (numerator / denominator) * 100));
}
