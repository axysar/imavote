"use client";
import { cn } from "@/lib/utils";

interface ResultsChartProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  className?: string;
}

export function ResultsChart({
  yesVotes,
  noVotes,
  abstainVotes,
  className,
}: ResultsChartProps) {
  const total = yesVotes + noVotes + abstainVotes;
  if (total === 0) return <p className="text-zinc-500 text-sm">No votes yet</p>;

  const segments = [
    { label: "Yes", count: yesVotes, pct: (yesVotes / total) * 100, color: "bg-emerald-500" },
    { label: "No", count: noVotes, pct: (noVotes / total) * 100, color: "bg-red-500" },
    { label: "Abstain", count: abstainVotes, pct: (abstainVotes / total) * 100, color: "bg-zinc-500" },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800">
        {segments.map((s) => (
          <div
            key={s.label}
            className={cn(s.color, "transition-all duration-700")}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", s.color)} />
            <span className="text-zinc-400">
              {s.label}: {s.count} ({s.pct.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
