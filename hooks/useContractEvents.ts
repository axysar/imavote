"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  parseAbiItem,
  type Log,
  type AbiEvent,
  encodeEventTopics,
} from "viem";
import { VOTING_CORE_ADDRESS } from "@/lib/contracts";

export type ActivityEventType =
  | "ProposalCreated"
  | "ProposalActivated"
  | "ProposalClosed"
  | "VoteCast"
  | "VoterRegistered";

export interface ActivityEvent {
  type: ActivityEventType;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  args: Record<string, unknown>;
}

const EVENTS: { name: ActivityEventType; abi: AbiEvent }[] = [
  {
    name: "ProposalCreated",
    abi: parseAbiItem(
      "event ProposalCreated(uint256 indexed id, string title, address indexed creator, uint256 deadline)",
    ) as AbiEvent,
  },
  {
    name: "ProposalActivated",
    abi: parseAbiItem(
      "event ProposalActivated(uint256 indexed id, uint256 activatedAt)",
    ) as AbiEvent,
  },
  {
    name: "ProposalClosed",
    abi: parseAbiItem(
      "event ProposalClosed(uint256 indexed id, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)",
    ) as AbiEvent,
  },
  {
    name: "VoteCast",
    abi: parseAbiItem(
      "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 selection)",
    ) as AbiEvent,
  },
  {
    name: "VoterRegistered",
    abi: parseAbiItem(
      "event VoterRegistered(address indexed voter)",
    ) as AbiEvent,
  },
];

// Build a topic0 → event name lookup table at module load time.
// This is the correct way to identify events — by their keccak256 signature.
const TOPIC_TO_NAME = new Map<string, ActivityEventType>();
for (const { name, abi } of EVENTS) {
  const topics = encodeEventTopics({
    abi: [abi] as readonly AbiEvent[],
    eventName: abi.name,
  } as Parameters<typeof encodeEventTopics>[0]);
  const topic0 = topics[0];
  if (topic0) TOPIC_TO_NAME.set(topic0, name);
}

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
        const fromBlock =
          currentBlock > blockRange ? currentBlock - blockRange : 0n;

        const allLogs: Log[] = [];
        for (const { abi } of EVENTS) {
          try {
            const logs = await client!.getLogs({
              address: VOTING_CORE_ADDRESS,
              event: abi,
              fromBlock,
              toBlock: "latest",
            });
            allLogs.push(...logs);
          } catch {
            // Event type may not have been emitted yet
          }
        }

        if (cancelled) return;

        const parsed: ActivityEvent[] = [];
        for (const log of allLogs) {
          const topic0 = log.topics?.[0];
          const eventType = topic0 ? TOPIC_TO_NAME.get(topic0) : undefined;
          if (!eventType) continue;

          parsed.push({
            type: eventType,
            blockNumber: log.blockNumber ?? 0n,
            transactionHash: log.transactionHash ?? ("0x" as `0x${string}`),
            args:
              (log as unknown as { args: Record<string, unknown> }).args ?? {},
          });
        }

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
