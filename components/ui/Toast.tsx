"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "info" | "success" | "error" | "loading";

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  hash?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Omit<Toast, "id">>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${++toastCounter}`;
      const newToast: Toast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      if (toast.variant !== "loading") {
        const duration = toast.duration ?? 5000;
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast],
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<Omit<Toast, "id">>) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
      if (updates.variant && updates.variant !== "loading") {
        const duration = updates.duration ?? 5000;
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, updateToast }),
    [toasts, addToast, removeToast, updateToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

const icons: Record<ToastVariant, ReactNode> = {
  info: <Info className="h-4 w-4 text-indigo-400" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  error: <AlertCircle className="h-4 w-4 text-red-400" />,
  loading: <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />,
};

const ringColors: Record<ToastVariant, string> = {
  info: "ring-indigo-500/20",
  success: "ring-emerald-500/20",
  error: "ring-red-500/20",
  loading: "ring-indigo-500/20",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto animate-fade-in rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl",
        "px-4 py-3 shadow-xl ring-1",
        ringColors[toast.variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icons[toast.variant]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
              {toast.description}
            </p>
          )}
          {toast.hash && (
            <p className="mt-1 text-xs font-mono text-zinc-500 truncate">
              tx: {toast.hash}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
