/**
 * VotingCore contract ABI and address resolution.
 *
 * Keep this file in sync with `contracts/VotingCore.sol`. Only public/external
 * functions consumed by the frontend are exported; admin-only writes are
 * included because the admin panel calls them too.
 */

export const VOTING_CORE_ABI = [
  // ------------------------------ Reads -------------------------------------
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRegisteredVoters",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "proposals",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "yesVotes", type: "uint256" },
      { name: "noVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" },
      { name: "state", type: "uint8" },
      { name: "createdAt", type: "uint256" },
      { name: "activatedAt", type: "uint256" },
      { name: "closedAt", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_offset", type: "uint256" },
      { name: "_limit", type: "uint256" },
    ],
    name: "getProposals",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "yesVotes", type: "uint256" },
          { name: "noVotes", type: "uint256" },
          { name: "abstainVotes", type: "uint256" },
          { name: "state", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "activatedAt", type: "uint256" },
          { name: "closedAt", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_proposalId", type: "uint256" }],
    name: "getParticipationRate",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_voter", type: "address" }],
    name: "isVoterRegistered",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_voter", type: "address" },
      { name: "_proposalId", type: "uint256" },
    ],
    name: "hasVoted",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "role", type: "bytes32" }, { name: "account", type: "address" }],
    name: "hasRole",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REGISTRAR_ROLE",
    outputs: [{ type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },

  // ------------------------------ Writes ------------------------------------
  {
    inputs: [
      { name: "_proposalId", type: "uint256" },
      { name: "_selection", type: "uint8" },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_deadline", type: "uint256" },
    ],
    name: "createProposal",
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_id", type: "uint256" }],
    name: "activateProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_id", type: "uint256" }],
    name: "closeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_voter", type: "address" }],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_voters", type: "address[]" }],
    name: "batchRegisterVoters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_voter", type: "address" }],
    name: "deregisterVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },

  // ------------------------------ Events ------------------------------------
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: false, name: "title", type: "string" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "deadline", type: "uint256" },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "voter", type: "address" },
      { indexed: true, name: "proposalId", type: "uint256" },
      { indexed: false, name: "selection", type: "uint8" },
    ],
    name: "VoteCast",
    type: "event",
  },
] as const;

/**
 * Resolves the VotingCore address from (in order):
 *  1. NEXT_PUBLIC_CONTRACT_ADDRESS env var
 *  2. Hardhat deterministic default (first deploy from the first signer)
 */
export const VOTING_CORE_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined) ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const DEFAULT_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111",
);

// Solidity enum mirror — keep in sync with VotingCore.ProposalState.
export enum ProposalState {
  Pending = 0,
  Active = 1,
  Closed = 2,
}

// Solidity enum mirror — keep in sync with VotingCore.VoteOption.
export enum VoteOption {
  Yes = 0,
  No = 1,
  Abstain = 2,
}

export interface ProposalView {
  id: bigint;
  title: string;
  description: string;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  state: number;
  createdAt: bigint;
  activatedAt: bigint;
  closedAt: bigint;
  deadline: bigint;
}

/* ========================================================================== */
/*  VoteDelegation                                                            */
/* ========================================================================== */

export const DELEGATION_ABI = [
  // Reads
  {
    inputs: [{ name: "_delegator", type: "address" }],
    name: "getDelegate",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_delegate", type: "address" }],
    name: "getWeight",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_delegate", type: "address" }],
    name: "getProfile",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "delegations",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "delegatedWeight",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Writes
  {
    inputs: [{ name: "_delegate", type: "address" }],
    name: "setDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_profileURI", type: "string" }],
    name: "setProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "delegator", type: "address" },
      { indexed: true, name: "delegate", type: "address" },
    ],
    name: "DelegateSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "delegator", type: "address" },
      { indexed: true, name: "previousDelegate", type: "address" },
    ],
    name: "DelegateRemoved",
    type: "event",
  },
] as const;

export const DELEGATION_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_DELEGATION_ADDRESS as `0x${string}` | undefined) ??
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
