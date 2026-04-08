"use client";

import { useMemo, useState } from "react";
import { Inbox, Search, TrendingUp, Users, Vote, Activity } from "lucide-react";
import { ProposalCard, ProposalCardSkeleton } from "@/components/ProposalCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import {
  useProposals,
  useProposalCount,
  useTotalRegisteredVoters,
  useIsPaused,
} from "@/hooks/useVotingContract";
import { ProposalState } from "@/lib/contracts";
import { formatVoteCount } from "@/lib/utils";

type FilterKey = "all" | "active" | "pending" | "closed";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "closed", label: "Closed" },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const { proposals, isLoading, isError, refetch } = useProposals(1n, 100n);
  const { data: totalVoters } = useTotalRegisteredVoters();
  const { data: proposalCount } = useProposalCount();
  const { data: isPaused } = useIsPaused();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return proposals.filter((p) => {
      if (filter === "active" && p.state !== ProposalState.Active) return false;
      if (filter === "pending" && p.state !== ProposalState.Pending) return false;
      if (filter === "closed" && p.state !== ProposalState.Closed) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [proposals, filter, query]);

  const stats = useMemo(() => {
    const activeCount = proposals.filter(
      (p) => p.state === ProposalState.Active,
    ).length;
    const totalVotes = proposals.reduce(
      (sum, p) => sum + Number(p.yesVotes + p.noVotes + p.abstainVotes),
      0,
    );
    return { activeCount, totalVotes };
  }, [proposals]);

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge variant="info" dot>
            Live on-chain
          </Badge>
          {isPaused ? (
            <Badge variant="danger" dot>
              System paused
            </Badge>
          ) : null}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
          Governance Dashboard
        </h1>
        <p className="mt-3 text-zinc-400 text-lg max-w-2xl">
          Browse every on-chain proposal, track participation, and cast your
          vote — all verifiable from Ethereum state.
        </p>
      </header>

      {isPaused ? (
        <Alert variant="warning" title="Voting is paused" className="mb-8">
          Emergency pause is currently active. New votes cannot be cast until
          an administrator resumes the contract.
        </Alert>
      ) : null}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Vote className="h-4 w-4" />}
          label="Total Proposals"
          value={proposalCount !== undefined ? String(proposalCount) : "—"}
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Active Now"
          value={String(stats.activeCount)}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Registered Voters"
          value={totalVoters !== undefined ? String(totalVoters) : "—"}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Votes Cast"
          value={formatVoteCount(stats.totalVotes)}
        />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            name="proposal-search"
            placeholder="Search proposals…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11"
            aria-label="Search proposals"
          />
        </div>
        <div
          role="tablist"
          aria-label="Filter proposals by state"
          className="flex gap-1 p-1 rounded-xl bg-zinc-900/60 border border-white/5"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === f.key
                  ? "bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {isError ? (
        <Alert variant="error" title="Unable to load proposals">
          The VotingCore contract couldn&apos;t be reached. Double-check the
          configured contract address and network.{" "}
          <button
            onClick={() => refetch()}
            className="underline hover:text-red-100"
          >
            Retry
          </button>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProposalCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title={
            proposals.length === 0
              ? "No proposals yet"
              : "No matching proposals"
          }
          description={
            proposals.length === 0
              ? "An administrator needs to create the first proposal. Head to the admin panel to get started."
              : "Try clearing filters or adjusting your search query."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProposalCard
              key={p.id.toString()}
              proposal={{
                id: p.id,
                title: p.title,
                description: p.description,
                yesVotes: p.yesVotes,
                noVotes: p.noVotes,
                abstainVotes: p.abstainVotes,
                state: p.state,
                createdAt: p.createdAt,
                deadline: p.deadline,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card interactive className="p-5">
      <CardContent>
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          {icon}
          <p className="text-xs uppercase tracking-wider">{label}</p>
        </div>
        <p className="text-2xl font-black tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
