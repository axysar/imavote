import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const styles: Record<AlertVariant, string> = {
  info: "border-indigo-500/20 bg-indigo-500/5 text-indigo-200",
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-200",
  warning: "border-amber-500/20 bg-amber-500/5 text-amber-200",
  error: "border-red-500/20 bg-red-500/5 text-red-200",
};

const icons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-4 w-4" aria-hidden="true" />,
  success: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
  warning: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
  error: <AlertCircle className="h-4 w-4" aria-hidden="true" />,
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm",
        styles[variant],
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">{icons[variant]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-zinc-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
