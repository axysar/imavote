"use client";

import { cn } from "@/lib/utils";

interface ResultsChartProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  className?: string;
  showLegend?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ResultsChart({
  yesVotes,
  noVotes,
  abstainVotes,
  className,
  showLegend = true,
  size = "md",
}: ResultsChartProps) {
  const total = yesVotes + noVotes + abstainVotes;

  const barHeight = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";

  if (total === 0) {
    return (
      <div className={cn("space-y-2", className)} aria-live="polite">
        <div
          className={cn(
            barHeight,
            "rounded-full bg-zinc-800 border border-dashed border-white/10",
          )}
        />
        <p className="text-xs text-zinc-500 text-center">No votes yet</p>
      </div>
    );
  }

  const segments = [
    {
      label: "Yes",
      count: yesVotes,
      pct: (yesVotes / total) * 100,
      color: "bg-emerald-500",
      dot: "bg-emerald-400",
    },
    {
      label: "No",
      count: noVotes,
      pct: (noVotes / total) * 100,
      color: "bg-red-500",
      dot: "bg-red-400",
    },
    {
      label: "Abstain",
      count: abstainVotes,
      pct: (abstainVotes / total) * 100,
      color: "bg-zinc-500",
      dot: "bg-zinc-400",
    },
  ];

  return (
    <div
      className={cn("space-y-3", className)}
      role="img"
      aria-label={`Vote results: ${yesVotes} yes, ${noVotes} no, ${abstainVotes} abstain`}
    >
      <div
        className={cn(
          "flex rounded-full overflow-hidden bg-zinc-800 ring-1 ring-white/5",
          barHeight,
        )}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className={cn(s.color, "transition-all duration-700")}
            style={{ width: `${s.pct}%` }}
            title={`${s.label}: ${s.pct.toFixed(1)}%`}
          />
        ))}
      </div>

      {showLegend && (
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 rounded-full shrink-0", s.dot)}
                aria-hidden="true"
              />
              <span className="text-zinc-400">
                <span className="text-zinc-200 font-medium">{s.label}</span>{" "}
                <span className="tabular-nums">{s.count}</span>{" "}
                <span className="text-zinc-500">({s.pct.toFixed(0)}%)</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
