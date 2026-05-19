"use client";

import Link from "next/link";
import {
  ArrowRight,
  Github,
  Lock,
  Scale,
  Sparkles,
  TimerReset,
  Zap,
} from "lucide-react";
import {
  useProposalCount,
  useTotalRegisteredVoters,
  useProposals,
} from "@/hooks/useVotingContract";
import { formatVoteCount } from "@/lib/utils";
import { ProposalState } from "@/lib/contracts";
import { getChainMeta } from "@/lib/chains";
import { useChainId } from "wagmi";

export default function Home() {
  const chainId = useChainId();
  const chainMeta = getChainMeta(chainId);
  const { data: proposalCount } = useProposalCount();
  const { data: totalVoters } = useTotalRegisteredVoters();
  const { proposals } = useProposals(1n, 100n);

  const activeCount = proposals.filter(
    (p) => p.state === ProposalState.Active,
  ).length;
  const totalVotes = proposals.reduce(
    (sum, p) => sum + Number(p.yesVotes + p.noVotes + p.abstainVotes),
    0,
  );

  return (
    <main className="relative overflow-hidden">
      <div className="bg-hero-glow absolute inset-0 -z-10" />

      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live on {chainMeta.name}
        </div>

        <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter italic text-gradient leading-none">
          iMaVote
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed text-pretty">
          A sovereign voting protocol built on Ethereum. Every ballot is
          immutable, every tally is verifiable, and every participant maintains
          full control of their cryptographic identity.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            Enter Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com/axysar/imavote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold text-zinc-300 hover:bg-white/10 transition-all duration-200"
          >
            <Github className="h-4 w-4" />
            View Source
          </a>
        </div>

        {/* Live stats */}
        <div className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full">
          <StatTile
            label="Votes Cast"
            value={formatVoteCount(totalVotes)}
          />
          <StatTile
            label="Active Proposals"
            value={String(activeCount)}
          />
          <StatTile
            label="Total Proposals"
            value={proposalCount !== undefined ? String(proposalCount) : "—"}
          />
          <StatTile
            label="Registered Voters"
            value={totalVoters !== undefined ? String(totalVoters) : "—"}
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-3">
            Built on principles
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-gradient">
            Governance, reimagined.
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Four guarantees that traditional voting infrastructure can&apos;t
            make. We can — because the EVM enforces them.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<Lock className="h-5 w-5" />}
            title="Immutable"
            description="Once a vote is confirmed, it can never be altered — cryptographically guaranteed by Ethereum consensus."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Verifiable"
            description="Anyone can independently audit tallies by reading the contract. No trusted tellers required."
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Sovereign"
            description="Your wallet is your identity. No emails, no KYC, no centralized registries."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Gas-efficient"
            description="Custom errors, packed storage, and paginated reads keep write costs minimal."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-3">
            Lifecycle
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-gradient">
            How a vote flows.
          </h2>
        </div>

        <ol className="grid md:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="absolute -top-3 left-6 h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-zinc-950">
                {i + 1}
              </div>
              <step.Icon className="h-5 w-5 text-indigo-400 mb-3 mt-2" />
              <h3 className="font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-gradient">
          Ready to cast your first vote?
        </h2>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25"
        >
          Open the dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </main>
  );
}

const STEPS = [
  {
    title: "Admin creates",
    description:
      "A proposal is drafted with an optional deadline and opens in Pending.",
    Icon: Sparkles,
  },
  {
    title: "Activate",
    description: "The admin opens voting, transitioning the proposal to Active.",
    Icon: Zap,
  },
  {
    title: "Voters cast",
    description:
      "Registered wallets sign a Yes, No or Abstain transaction — one per address.",
    Icon: Scale,
  },
  {
    title: "Close & verify",
    description:
      "Results are finalized on-chain. Anyone can independently verify the tally.",
    Icon: TimerReset,
  },
];

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <p className="text-3xl font-black tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 hover:bg-white/[0.04] transition-all">
      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
