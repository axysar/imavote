import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl p-6",
        interactive &&
          "transition-all duration-200 hover:border-white/10 hover:bg-zinc-900/70",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-bold tracking-tight text-white", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-zinc-400 mt-1 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-5 pt-4 border-t border-white/5 flex items-center gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
