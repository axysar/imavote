"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VOTING_CORE_ABI, VOTING_CORE_ADDRESS } from "@/lib/contracts";

export function useProposalCount() {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "proposalCount",
  });
}

export function useProposal(id: bigint) {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "proposals",
    args: [id],
  });
}

export function useCastVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const castVote = (proposalId: bigint, selection: number) => {
    writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "castVote",
      args: [proposalId, selection],
    });
  };

  return { castVote, isPending, isConfirming, isSuccess, error };
}
