"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash?: `0x${string}`;
}

interface UseTransactionToastOptions {
  pendingTitle?: string;
  confirmingTitle?: string;
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
}

export function useTransactionToast(
  state: TransactionState,
  options: UseTransactionToastOptions = {},
) {
  const { addToast, updateToast } = useToast();
  const toastIdRef = useRef<string | null>(null);
  const prevPendingRef = useRef(false);

  const {
    pendingTitle = "Awaiting signature…",
    confirmingTitle = "Confirming transaction…",
    successTitle = "Transaction confirmed",
    successDescription,
    errorTitle = "Transaction failed",
  } = options;

  useEffect(() => {
    if (state.isPending && !prevPendingRef.current) {
      toastIdRef.current = addToast({
        variant: "loading",
        title: pendingTitle,
        description: "Please sign in your wallet.",
      });
    }
    prevPendingRef.current = state.isPending;
  }, [state.isPending, addToast, pendingTitle]);

  useEffect(() => {
    if (state.isConfirming && toastIdRef.current) {
      updateToast(toastIdRef.current, {
        variant: "loading",
        title: confirmingTitle,
        description: "Waiting for network confirmation.",
        hash: state.hash,
      });
    }
  }, [state.isConfirming, state.hash, updateToast, confirmingTitle]);

  useEffect(() => {
    if (state.isSuccess && toastIdRef.current) {
      updateToast(toastIdRef.current, {
        variant: "success",
        title: successTitle,
        description: successDescription ?? "Your transaction has been mined.",
        hash: state.hash,
      });
      toastIdRef.current = null;
    }
  }, [state.isSuccess, state.hash, updateToast, successTitle, successDescription]);

  useEffect(() => {
    if (state.error && toastIdRef.current) {
      updateToast(toastIdRef.current, {
        variant: "error",
        title: errorTitle,
        description: state.error.message?.slice(0, 120),
      });
      toastIdRef.current = null;
    }
  }, [state.error, updateToast, errorTitle]);
}
