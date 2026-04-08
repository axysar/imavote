import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-zinc-800/70 via-zinc-700/40 to-zinc-800/70",
        className,
      )}
      {...props}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}
