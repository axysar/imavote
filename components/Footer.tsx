import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-white/5 bg-zinc-950/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-xl font-black tracking-tighter italic text-white">
            iMa<span className="text-indigo-400">Vote</span>
          </p>
          <p className="mt-3 text-sm text-zinc-500 max-w-sm leading-relaxed">
            A sovereign voting protocol built on Ethereum. Immutable ballots,
            verifiable tallies, open-source and audited.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Product
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
            Resources
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/axysar/imavote"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://sepolia.etherscan.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Sepolia Etherscan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            © {year} AxAy Labs AB · Released under the MIT License.
          </p>
          <p className="text-xs text-zinc-500">
            Built with Next.js, Wagmi, Viem and Solidity 0.8.20
          </p>
        </div>
      </div>
    </footer>
  );
}
