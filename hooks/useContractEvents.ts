"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem, type Log } from "viem";
import { VOTING_CORE_ADDRESS } from "@/lib/contracts";

export interface ActivityEvent {
  type: "ProposalCreated" | "ProposalActivated" | "ProposalClosed" | "VoteCast" | "VoterRegistered";
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  args: Record<string, unknown>;
  timestamp?: number;
}

const EVENT_SIGS = [
  parseAbiItem("event ProposalCreated(uint256 indexed id, string title, address indexed creator, uint256 deadline)"),
  parseAbiItem("event ProposalActivated(uint256 indexed id, uint256 activatedAt)"),
  parseAbiItem("event ProposalClosed(uint256 indexed id, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)"),
  parseAbiItem("event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 selection)"),
  parseAbiItem("event VoterRegistered(address indexed voter)"),
];

const EVENT_NAMES: Record<string, ActivityEvent["type"]> = {
  "0x8240dedc1a7cd0a0db0adcc5a07a746a7f2b98a0f702e3ac4d32200a9e28abee": "ProposalCreated",
  "0x": "ProposalActivated",
};

export function useRecentActivity(blockRange = 5000n) {
  const client = usePublicClient();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;

    async function fetchEvents() {
      try {
        setIsLoading(true);
        const currentBlock = await client!.getBlockNumber();
        const fromBlock = currentBlock > blockRange ? currentBlock - blockRange : 0n;

        const allLogs: Log[] = [];
        for (const eventAbi of EVENT_SIGS) {
          try {
            const logs = await client!.getLogs({
              address: VOTING_CORE_ADDRESS,
              event: eventAbi,
              fromBlock,
              toBlock: "latest",
            });
            allLogs.push(...logs);
          } catch {
            // Some events may not exist yet — skip silently
          }
        }

        if (cancelled) return;

        const parsed: ActivityEvent[] = allLogs.map((log) => {
          const eventName = identifyEvent(log);
          return {
            type: eventName,
            blockNumber: log.blockNumber ?? 0n,
            transactionHash: log.transactionHash ?? ("0x" as `0x${string}`),
            args: (log as unknown as { args: Record<string, unknown> }).args ?? {},
          };
        });

        parsed.sort((a, b) => Number(b.blockNumber - a.blockNumber));
        setEvents(parsed);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchEvents();
    const interval = setInterval(fetchEvents, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [client, blockRange]);

  return { events, isLoading, error };
}

function identifyEvent(log: Log): ActivityEvent["type"] {
  const topic = log.topics?.[0];
  if (!topic) return "VoterRegistered";
  // Match by topic0 prefix
  if (topic.startsWith("0x8240")) return "ProposalCreated";
  if (topic.startsWith("0x")) {
    // Try matching by number of topics and data length
    const numTopics = log.topics?.length ?? 0;
    if (numTopics === 3 && log.data && log.data.length > 66) return "VoteCast";
    if (numTopics === 2 && log.data && log.data.length <= 66) return "ProposalActivated";
    if (numTopics === 2 && log.data && log.data.length > 66) return "ProposalClosed";
    if (numTopics === 2) return "VoterRegistered";
  }
  return "VoterRegistered";
}
