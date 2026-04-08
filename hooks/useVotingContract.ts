"use client";

import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { keccak256, toHex } from "viem";
import {
  VOTING_CORE_ABI,
  VOTING_CORE_ADDRESS,
  type ProposalView,
} from "@/lib/contracts";

/* -------------------------------------------------------------------------- */
/*  Reads                                                                     */
/* -------------------------------------------------------------------------- */

export function useProposalCount() {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "proposalCount",
    query: { refetchInterval: 15_000 },
  });
}

export function useTotalRegisteredVoters() {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "totalRegisteredVoters",
    query: { refetchInterval: 30_000 },
  });
}

export function useIsPaused() {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "paused",
  });
}

export function useProposal(id: bigint | undefined) {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "proposals",
    args: id !== undefined ? [id] : undefined,
    query: { enabled: id !== undefined && id > 0n },
  });
}

/**
 * Fetches a paginated slice of proposals via the contract's `getProposals`
 * helper. Returns them newest-first for a nicer UX.
 */
export function useProposals(offset = 1n, limit = 50n) {
  const result = useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "getProposals",
    args: [offset, limit],
    query: { refetchInterval: 15_000 },
  });

  const proposals = ((result.data as ProposalView[] | undefined) ?? [])
    .slice()
    .sort((a, b) => Number(b.id - a.id));

  return { ...result, proposals };
}

export function useParticipationRate(id: bigint | undefined) {
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "getParticipationRate",
    args: id !== undefined ? [id] : undefined,
    query: { enabled: id !== undefined && id > 0n },
  });
}

export function useIsVoterRegistered() {
  const { address } = useAccount();
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "isVoterRegistered",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

export function useHasVoted(proposalId: bigint | undefined) {
  const { address } = useAccount();
  return useReadContract({
    address: VOTING_CORE_ADDRESS,
    abi: VOTING_CORE_ABI,
    functionName: "hasVoted",
    args: address && proposalId !== undefined ? [address, proposalId] : undefined,
    query: { enabled: Boolean(address && proposalId !== undefined) },
  });
}

/** Derived hook: is the connected account an admin or registrar? */
export function useAccessRoles() {
  const { address } = useAccount();
  const adminRole =
    "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
  const registrarRole = keccak256(toHex("REGISTRAR_ROLE"));

  const { data, isLoading } = useReadContracts({
    contracts: address
      ? [
          {
            address: VOTING_CORE_ADDRESS,
            abi: VOTING_CORE_ABI,
            functionName: "hasRole",
            args: [adminRole, address],
          },
          {
            address: VOTING_CORE_ADDRESS,
            abi: VOTING_CORE_ABI,
            functionName: "hasRole",
            args: [registrarRole, address],
          },
        ]
      : [],
    query: { enabled: Boolean(address) },
  });

  return {
    isAdmin: Boolean(data?.[0]?.result),
    isRegistrar: Boolean(data?.[1]?.result),
    isLoading,
  };
}

/* -------------------------------------------------------------------------- */
/*  Writes                                                                    */
/* -------------------------------------------------------------------------- */

/** Generic write-transaction helper that exposes lifecycle state + a reset. */
function useVotingWrite() {
  const { writeContract, writeContractAsync, data: hash, isPending, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  return {
    writeContract,
    writeContractAsync,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: error ?? receiptError,
    reset,
  };
}

export function useCastVote() {
  const base = useVotingWrite();
  const castVote = (proposalId: bigint, selection: number) =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "castVote",
      args: [proposalId, selection],
    });
  return { ...base, castVote };
}

export function useCreateProposal() {
  const base = useVotingWrite();
  const createProposal = (title: string, description: string, deadline = 0n) =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "createProposal",
      args: [title, description, deadline],
    });
  return { ...base, createProposal };
}

export function useActivateProposal() {
  const base = useVotingWrite();
  const activateProposal = (id: bigint) =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "activateProposal",
      args: [id],
    });
  return { ...base, activateProposal };
}

export function useCloseProposal() {
  const base = useVotingWrite();
  const closeProposal = (id: bigint) =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "closeProposal",
      args: [id],
    });
  return { ...base, closeProposal };
}

export function useRegisterVoter() {
  const base = useVotingWrite();
  const registerVoter = (voter: `0x${string}`) =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "registerVoter",
      args: [voter],
    });
  return { ...base, registerVoter };
}

export function usePauseControls() {
  const base = useVotingWrite();
  const pause = () =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "pause",
    });
  const unpause = () =>
    base.writeContract({
      address: VOTING_CORE_ADDRESS,
      abi: VOTING_CORE_ABI,
      functionName: "unpause",
    });
  return { ...base, pause, unpause };
}
