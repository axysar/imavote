import { ProposalCard } from "@/components/ProposalCard";
import { Card, CardContent } from "@/components/ui/Card";

// Placeholder data — will be replaced with on-chain reads via Wagmi
const MOCK_PROPOSALS = [
  {
    title: "Annual Budget Allocation 2025",
    description: "Approve the proposed budget of 500 ETH for operations, development, and marketing.",
    yesVotes: 847,
    noVotes: 123,
    state: "Active" as const,
  },
  {
    title: "Community Grant Program",
    description: "Establish a 50 ETH grant fund for ecosystem contributors and open-source developers.",
    yesVotes: 1204,
    noVotes: 89,
    state: "Active" as const,
  },
  {
    title: "Protocol Upgrade v2.0",
    description: "Approve the migration to the new VotingCore contract with enhanced security features.",
    yesVotes: 2341,
    noVotes: 156,
    state: "Closed" as const,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <header className="mb-16">
        <h1 className="text-5xl font-black tracking-tighter">Dashboard</h1>
        <p className="mt-3 text-zinc-400 text-lg">
          View active proposals, cast your vote, and track results in real-time.
        </p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Proposals", value: "23" },
          { label: "Active Now", value: "2" },
          { label: "Your Votes", value: "15" },
          { label: "Participation", value: "87%" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPOSALS.map((p, i) => (
          <ProposalCard key={i} {...p} />
        ))}
      </div>
    </main>
  );
}
