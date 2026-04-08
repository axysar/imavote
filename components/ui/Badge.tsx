import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300 border-white/10",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-zinc-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-indigo-400",
};

export function Badge({
  children,
  variant = "default",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full " +
          "text-xs font-medium border whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
