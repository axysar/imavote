export default function Loading() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4" aria-busy="true">
        <div
          className="h-10 w-10 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    </main>
  );
}
