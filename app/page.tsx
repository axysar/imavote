import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Now live on Sepolia Testnet
        </div>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter italic bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
          iMaVote
        </h1>

        <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          A sovereign voting protocol built on Ethereum. Every ballot is
          immutable, every tally is verifiable, and every participant maintains
          full control of their cryptographic identity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Enter Dashboard →
          </Link>
          <a
            href="https://github.com/itsaxay/imavote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold text-zinc-300 hover:bg-white/10 transition-all duration-200"
          >
            View Source
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full">
        {[
          { label: "Votes Cast", value: "12,847" },
          { label: "Active Proposals", value: "5" },
          { label: "Registered Voters", value: "2,341" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
