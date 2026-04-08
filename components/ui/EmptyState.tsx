import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 " +
          "rounded-2xl border border-dashed border-white/10 bg-white/[0.02]",
        className,
      )}
    >
      {icon && (
        <div className="h-12 w-12 mb-4 rounded-xl bg-white/5 text-zinc-400 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-zinc-500 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
