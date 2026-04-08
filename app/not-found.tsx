import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center mb-6">
          <Compass className="h-6 w-6" />
        </div>
        <p className="text-sm font-mono text-zinc-500 tracking-widest uppercase">
          404
        </p>
        <h1 className="text-4xl font-black tracking-tighter mt-2">
          Page not found
        </h1>
        <p className="mt-3 text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </main>
  );
}
