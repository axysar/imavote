"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console in dev — in production this would ship to Sentry, etc.
    // eslint-disable-next-line no-console
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter">
          Something went wrong
        </h1>
        <p className="mt-3 text-zinc-400">
          An unexpected error occurred while rendering this page. You can try
          again or return home.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-zinc-600 font-mono">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-200 font-semibold hover:bg-white/10 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
