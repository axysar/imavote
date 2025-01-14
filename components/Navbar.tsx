import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter italic text-white"
        >
          iMaVote
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Admin
          </Link>
        </div>

        <ConnectWallet />
      </div>
    </nav>
  );
}
