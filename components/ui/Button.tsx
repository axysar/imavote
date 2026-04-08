"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl " +
  "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 " +
    "shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
  secondary:
    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 border border-white/10",
  ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
  destructive:
    "bg-red-600/10 text-red-400 hover:bg-red-600/20 active:bg-red-600/30 border border-red-500/20",
  outline:
    "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 active:bg-white/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isLoading && loadingText ? loadingText : children}
      </button>
    );
  },
);
Button.displayName = "Button";
