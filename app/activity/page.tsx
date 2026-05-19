"use client";

import {
  Activity,
  FileText,
  Play,
  XCircle,
  Vote,
  UserPlus,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  useRecentActivity,
  type ActivityEvent,
} from "@/hooks/useContractEvents";
import { truncateAddress } from "@/lib/utils";

const EVENT_META: Record<
  ActivityEvent["type"],
  { label: string; icon: typeof Activity; variant: "success" | "info" | "warning" | "danger" | "default" }
> = {
  ProposalCreated: { label: "Proposal Created", icon: FileText, variant: "info" },
  ProposalActivated: { label: "Proposal Activated", icon: Play, variant: "success" },
  ProposalClosed: { label: "Proposal Closed", icon: XCircle, variant: "danger" },
  VoteCast: { label: "Vote Cast", icon: Vote, variant: "default" },
  VoterRegistered: { label: "Voter Registered", icon: UserPlus, variant: "warning" },
};

export default function ActivityPage() {
  const { events, isLoading, error } = useRecentActivity();

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="info" dot>
            Live Feed
          </Badge>
          <Badge variant="default">Auto-refreshes every 30s</Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
          Activity Feed
        </h1>
        <p className="mt-3 text-zinc-400 text-lg max-w-2xl">
          Real-time log of every on-chain governance action — proposals,
          votes, registrations. All sourced directly from contract events.
        </p>
      </header>

      {error && (
        <Alert variant="error" title="Failed to load events" className="mb-6">
          {error.message}
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-6 w-6" />}
          title="No activity yet"
          description="Events will appear here as proposals are created, votes are cast, and voters are registered."
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  {events.length} event{events.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                aria-label="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-white/5" role="list">
              {events.map((ev, i) => {
                const meta = EVENT_META[ev.type];
                const Icon = meta.icon;
                return (
                  <li
                    key={`${ev.transactionHash}-${i}`}
                    className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`shrink-0 mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center
                        ${meta.variant === "success" ? "bg-emerald-500/10 text-emerald-400" : ""}
                        ${meta.variant === "info" ? "bg-indigo-500/10 text-indigo-400" : ""}
                        ${meta.variant === "warning" ? "bg-amber-500/10 text-amber-400" : ""}
                        ${meta.variant === "danger" ? "bg-red-500/10 text-red-400" : ""}
                        ${meta.variant === "default" ? "bg-zinc-500/10 text-zinc-400" : ""}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <span className="text-xs text-zinc-500 tabular-nums">
                          Block #{ev.blockNumber.toString()}
                        </span>
                      </div>
                      <EventDetails event={ev} />
                    </div>
                    <a
                      href={`#tx-${ev.transactionHash}`}
                      className="shrink-0 text-zinc-500 hover:text-indigo-400 transition-colors"
                      title="View transaction"
                      aria-label="View transaction"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function EventDetails({ event }: { event: ActivityEvent }) {
  const args = event.args;
  switch (event.type) {
    case "ProposalCreated":
      return (
        <p className="text-sm text-zinc-400 mt-1">
          <span className="font-mono text-xs text-zinc-500">
            {truncateAddress(String(args.creator ?? ""), 4)}
          </span>{" "}
          created proposal &ldquo;{String(args.title ?? "")}&rdquo;
        </p>
      );
    case "VoteCast": {
      const sel = Number(args.selection ?? 0);
      const label = sel === 0 ? "Yes" : sel === 1 ? "No" : "Abstain";
      return (
        <p className="text-sm text-zinc-400 mt-1">
          <span className="font-mono text-xs text-zinc-500">
            {truncateAddress(String(args.voter ?? ""), 4)}
          </span>{" "}
          voted <span className="font-semibold text-zinc-200">{label}</span>{" "}
          on proposal #{String(args.proposalId ?? "")}
        </p>
      );
    }
    case "VoterRegistered":
      return (
        <p className="text-sm text-zinc-400 mt-1">
          <span className="font-mono text-xs text-zinc-500">
            {truncateAddress(String(args.voter ?? ""), 4)}
          </span>{" "}
          was registered as a voter
        </p>
      );
    case "ProposalActivated":
      return (
        <p className="text-sm text-zinc-400 mt-1">
          Proposal #{String(args.id ?? "")} opened for voting
        </p>
      );
    case "ProposalClosed":
      return (
        <p className="text-sm text-zinc-400 mt-1">
          Proposal #{String(args.id ?? "")} closed — Yes:{" "}
          {String(args.yesVotes ?? 0)}, No: {String(args.noVotes ?? 0)},
          Abstain: {String(args.abstainVotes ?? 0)}
        </p>
      );
    default:
      return null;
  }
}
