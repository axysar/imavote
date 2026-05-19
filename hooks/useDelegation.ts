"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { DELEGATION_ABI, DELEGATION_ADDRESS } from "@/lib/contracts";

export function useMyDelegate() {
  const { address } = useAccount();
  return useReadContract({
    address: DELEGATION_ADDRESS,
    abi: DELEGATION_ABI,
    functionName: "getDelegate",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

export function useDelegateWeight(delegate: `0x${string}` | undefined) {
  return useReadContract({
    address: DELEGATION_ADDRESS,
    abi: DELEGATION_ABI,
    functionName: "getWeight",
    args: delegate ? [delegate] : undefined,
    query: { enabled: Boolean(delegate) },
  });
}

export function useDelegateProfile(delegate: `0x${string}` | undefined) {
  return useReadContract({
    address: DELEGATION_ADDRESS,
    abi: DELEGATION_ABI,
    functionName: "getProfile",
    args: delegate ? [delegate] : undefined,
    query: { enabled: Boolean(delegate) },
  });
}

function useDelegationWrite() {
  const { writeContract, data: hash, isPending, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } =
    useWaitForTransactionReceipt({ hash });
  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: error ?? receiptError,
    reset,
  };
}

export function useSetDelegate() {
  const base = useDelegationWrite();
  const setDelegate = (delegate: `0x${string}`) =>
    base.writeContract({
      address: DELEGATION_ADDRESS,
      abi: DELEGATION_ABI,
      functionName: "setDelegate",
      args: [delegate],
    });
  return { ...base, setDelegate };
}

export function useRemoveDelegate() {
  const base = useDelegationWrite();
  const removeDelegate = () =>
    base.writeContract({
      address: DELEGATION_ADDRESS,
      abi: DELEGATION_ABI,
      functionName: "removeDelegate",
    });
  return { ...base, removeDelegate };
}

export function useSetDelegateProfile() {
  const base = useDelegationWrite();
  const setProfile = (uri: string) =>
    base.writeContract({
      address: DELEGATION_ADDRESS,
      abi: DELEGATION_ABI,
      functionName: "setProfile",
      args: [uri],
    });
  return { ...base, setProfile };
}
