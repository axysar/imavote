"use client";

import Link from "next/link";
import { Clock, Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { ResultsChart } from "./ResultsChart";
import {
  formatRelativeTime,
  formatVoteCount,
  getProposalStateBadgeVariant,
  getProposalStateLabel,
} from "@/lib/utils";
import { ProposalState } from "@/lib/contracts";

export interface ProposalCardData {
  id: bigint;
  title: string;
  description: string;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  state: number;
  createdAt: bigint;
  deadline: bigint;
}

interface ProposalCardProps {
  proposal: ProposalCardData;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const {
    id,
    title,
    description,
    yesVotes,
    noVotes,
    abstainVotes,
    state,
    createdAt,
    deadline,
  } = proposal;

  const totalVotes = Number(yesVotes + noVotes + abstainVotes);
  const stateLabel = getProposalStateLabel(state);
  const badgeVariant = getProposalStateBadgeVariant(state);
  const isActive = state === ProposalState.Active;

  const deadlineLabel =
    deadline > 0n
      ? `Ends ${formatRelativeTime(deadline)}`
      : `Created ${formatRelativeTime(createdAt)}`;

  return (
    <Card interactive className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge variant={badgeVariant} dot>
            {stateLabel}
          </Badge>
          <span className="text-xs text-zinc-500 font-mono">#{id.toString()}</span>
        </div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="mt-2">
          <ResultsChart
            yesVotes={Number(yesVotes)}
            noVotes={Number(noVotes)}
            abstainVotes={Number(abstainVotes)}
          />
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {formatVoteCount(totalVotes)} votes
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {deadlineLabel}
          </span>
        </div>

        <Link href={`/proposals/${id}`} aria-label={`Open proposal ${title}`}>
          <Button
            variant={isActive ? "primary" : "outline"}
            size="sm"
            className="group"
          >
            {isActive ? "Vote" : "View"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export function ProposalCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 h-64 animate-pulse">
      <div className="h-4 w-16 bg-zinc-800 rounded-full mb-4" />
      <div className="h-5 w-4/5 bg-zinc-800 rounded mb-3" />
      <div className="h-4 w-full bg-zinc-800/70 rounded mb-1.5" />
      <div className="h-4 w-2/3 bg-zinc-800/70 rounded mb-6" />
      <div className="h-2 w-full bg-zinc-800 rounded-full mb-3" />
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-zinc-800 rounded" />
        <div className="h-8 w-20 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}
