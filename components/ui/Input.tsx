"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseField =
  "w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 text-white " +
  "placeholder:text-zinc-600 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          className={cn(
            baseField,
            error && "border-red-500/40 focus:ring-red-500/40",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-400">
            {error}
          </p>
        ) : helper ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-zinc-500">
            {helper}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          className={cn(
            baseField,
            "resize-none",
            error && "border-red-500/40 focus:ring-red-500/40",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-400">
            {error}
          </p>
        ) : helper ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-zinc-500">
            {helper}
          </p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
