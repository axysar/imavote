"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  MinusCircle,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  AlertTriangle,
  Users,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert } from "@/components/ui/Alert";
import { ResultsChart } from "@/components/ResultsChart";
import {
  useProposal,
  useCastVote,
  useIsVoterRegistered,
  useHasVoted,
  useParticipationRate,
  useIsPaused,
} from "@/hooks/useVotingContract";
import { ProposalState, VoteOption, VOTING_CORE_ADDRESS } from "@/lib/contracts";
import {
  formatRelativeTime,
  formatTimestamp,
  getProposalStateBadgeVariant,
  getProposalStateLabel,
  pct,
} from "@/lib/utils";

type ProposalTuple = readonly [
  bigint, // id
  string, // title
  string, // description
  bigint, // yesVotes
  bigint, // noVotes
  bigint, // abstainVotes
  number, // state
  bigint, // createdAt
  bigint, // activatedAt
  bigint, // closedAt
  bigint, // deadline
];

export default function ProposalDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => {
    try {
      return BigInt(params.id);
    } catch {
      return undefined;
    }
  }, [params.id]);

  const { isConnected } = useAccount();
  const { data, isLoading, isError, refetch } = useProposal(id);
  const { data: isRegistered } = useIsVoterRegistered();
  const { data: alreadyVoted } = useHasVoted(id);
  const { data: participationBps } = useParticipationRate(id);
  const { data: isPaused } = useIsPaused();

  const {
    castVote,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useCastVote();

  const [selection, setSelection] = useState<VoteOption | null>(null);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, refetch, reset]);

  if (id === undefined) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen py-16 px-6 md:px-12 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen py-16 px-6 max-w-2xl mx-auto">
        <Alert variant="error" title="Unable to load proposal">
          The proposal could not be read from the contract. It may not exist,
          or the network may be misconfigured.
        </Alert>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
      </main>
    );
  }

  const [
    proposalId,
    title,
    description,
    yesVotes,
    noVotes,
    abstainVotes,
    state,
    createdAt,
    activatedAt,
    closedAt,
    deadline,
  ] = data as unknown as ProposalTuple;

  if (proposalId === 0n) {
    return <NotFound />;
  }

  const totalVotes = Number(yesVotes + noVotes + abstainVotes);
  const isActive = state === ProposalState.Active;
  const stateLabel = getProposalStateLabel(state);
  const badgeVariant = getProposalStateBadgeVariant(state);
  const deadlineExpired =
    deadline > 0n && BigInt(Math.floor(Date.now() / 1000)) > deadline;

  const participationPct =
    participationBps !== undefined ? Number(participationBps) / 100 : 0;

  const canVote =
    isConnected &&
    isActive &&
    Boolean(isRegistered) &&
    !alreadyVoted &&
    !isPaused &&
    !deadlineExpired;

  const blockingReason = !isConnected
    ? "Connect your wallet to vote."
    : !isActive
    ? `This proposal is ${stateLabel.toLowerCase()}.`
    : isPaused
    ? "Voting is currently paused by an administrator."
    : deadlineExpired
    ? "The voting deadline has passed."
    : !isRegistered
    ? "Your wallet is not registered as a voter."
    : alreadyVoted
    ? "You have already voted on this proposal."
    : undefined;

  const onSubmit = () => {
    if (selection === null || !canVote) return;
    castVote(proposalId, selection);
  };

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 max-w-5xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={badgeVariant} dot>
            {stateLabel}
          </Badge>
          <Badge variant="default">
            <span className="font-mono">#{proposalId.toString()}</span>
          </Badge>
          {deadline > 0n && (
            <Badge variant={deadlineExpired ? "danger" : "info"}>
              <Clock className="h-3 w-3" aria-hidden="true" />
              {deadlineExpired
                ? `Ended ${formatRelativeTime(deadline)}`
                : `Ends ${formatRelativeTime(deadline)}`}
            </Badge>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
          {title}
        </h1>
        <p className="mt-4 text-zinc-400 text-lg leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Results + Voting */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Tally</CardTitle>
              <CardDescription>
                {totalVotes === 0
                  ? "No votes have been cast yet."
                  : `${totalVotes} ${
                      totalVotes === 1 ? "vote" : "votes"
                    } recorded on-chain.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsChart
                yesVotes={Number(yesVotes)}
                noVotes={Number(noVotes)}
                abstainVotes={Number(abstainVotes)}
                size="lg"
              />
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <TallyStat label="Yes" value={Number(yesVotes)} color="text-emerald-400" />
                <TallyStat label="No" value={Number(noVotes)} color="text-red-400" />
                <TallyStat
                  label="Abstain"
                  value={Number(abstainVotes)}
                  color="text-zinc-300"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cast your vote</CardTitle>
              <CardDescription>
                Votes are final and immutable once confirmed on Ethereum.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockingReason && (
                <Alert variant="warning" className="mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {blockingReason}
                  </div>
                </Alert>
              )}

              <div
                role="radiogroup"
                aria-label="Vote selection"
                className="grid gap-3 sm:grid-cols-3"
              >
                <VoteOptionButton
                  label="Yes"
                  description="Support this proposal"
                  icon={<ThumbsUp className="h-5 w-5" />}
                  active={selection === VoteOption.Yes}
                  accent="emerald"
                  disabled={!canVote}
                  onClick={() => setSelection(VoteOption.Yes)}
                />
                <VoteOptionButton
                  label="No"
                  description="Reject this proposal"
                  icon={<ThumbsDown className="h-5 w-5" />}
                  active={selection === VoteOption.No}
                  accent="red"
                  disabled={!canVote}
                  onClick={() => setSelection(VoteOption.No)}
                />
                <VoteOptionButton
                  label="Abstain"
                  description="Count me as present"
                  icon={<MinusCircle className="h-5 w-5" />}
                  active={selection === VoteOption.Abstain}
                  accent="zinc"
                  disabled={!canVote}
                  onClick={() => setSelection(VoteOption.Abstain)}
                />
              </div>

              {error && (
                <Alert variant="error" title="Transaction failed" className="mt-4">
                  {error.message}
                </Alert>
              )}
              {isSuccess && (
                <Alert variant="success" title="Vote recorded" className="mt-4">
                  Your vote has been permanently written to chain. Thank you
                  for participating.
                </Alert>
              )}

              <Button
                className="w-full mt-6"
                size="lg"
                disabled={!canVote || selection === null}
                isLoading={isPending || isConfirming}
                loadingText={isConfirming ? "Confirming transaction…" : "Signing…"}
                onClick={onSubmit}
              >
                Submit Vote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: metadata */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Proposal Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4 text-sm">
                <MetaRow
                  icon={<Users className="h-4 w-4" />}
                  label="Participation"
                  value={`${participationPct.toFixed(1)}%`}
                />
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden -mt-2">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${pct(participationPct, 100)}%` }}
                  />
                </div>
                <MetaRow
                  icon={<Circle className="h-4 w-4" />}
                  label="Created"
                  value={formatTimestamp(createdAt)}
                />
                {activatedAt > 0n && (
                  <MetaRow
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Activated"
                    value={formatTimestamp(activatedAt)}
                  />
                )}
                {closedAt > 0n && (
                  <MetaRow
                    icon={<XCircle className="h-4 w-4" />}
                    label="Closed"
                    value={formatTimestamp(closedAt)}
                  />
                )}
                {deadline > 0n && (
                  <MetaRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Deadline"
                    value={formatTimestamp(deadline)}
                  />
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <StatusRow ok={isConnected} label="Wallet connected" />
                <StatusRow
                  ok={Boolean(isRegistered)}
                  label="Registered voter"
                />
                <StatusRow
                  ok={!alreadyVoted}
                  label="Eligible for this proposal"
                  invertOk={alreadyVoted ? "Already voted" : undefined}
                />
              </ul>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured by VotingCore v2 · AccessControl + ReentrancyGuard
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${VOTING_CORE_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Verify on Etherscan
                </a>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function VoteOptionButton({
  label,
  description,
  icon,
  active,
  accent,
  disabled,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  accent: "emerald" | "red" | "zinc";
  disabled?: boolean;
  onClick: () => void;
}) {
  const accents = {
    emerald: "text-emerald-400 ring-emerald-500/40 bg-emerald-500/10",
    red: "text-red-400 ring-red-500/40 bg-red-500/10",
    zinc: "text-zinc-300 ring-zinc-400/40 bg-zinc-700/30",
  } as const;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={`group rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition-all
        hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${active ? `ring-2 ${accents[accent]}` : ""}`}
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3
          ${active ? accents[accent] : "bg-white/5 text-zinc-400"}`}
      >
        {icon}
      </div>
      <p className="font-semibold">{label}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
    </button>
  );
}

function TallyStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
      <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-zinc-500">
        {icon}
        {label}
      </dt>
      <dd className="text-zinc-200 text-right">{value}</dd>
    </div>
  );
}

function StatusRow({
  ok,
  label,
  invertOk,
}: {
  ok: boolean;
  label: string;
  invertOk?: string;
}) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 text-red-400" />
      )}
      <span className={ok ? "text-zinc-200" : "text-zinc-500"}>
        {ok ? label : invertOk ?? label}
      </span>
    </li>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen py-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-black">Proposal not found</h1>
      <p className="mt-2 text-zinc-400">
        The requested proposal does not exist on this contract.
      </p>
      <Link href="/dashboard">
        <Button variant="outline" className="mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
      </Link>
    </main>
  );
}
