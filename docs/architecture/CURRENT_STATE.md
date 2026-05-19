# Current Architecture State

> iMaVote v2.0.0 -- Enterprise-grade decentralized e-voting protocol on Ethereum
> Snapshot date: 2026-05-19

---

## System Overview

iMaVote is a fully client-side blockchain voting dapp. There is no backend server, no database, and no indexer. All state lives on-chain; the frontend reads it via direct RPC calls through Wagmi v2 / Viem.

| Dimension | Value |
|---|---|
| Solidity contracts | 3 (504 LOC total) |
| Frontend components | 28 `.tsx` files (3,615 LOC) |
| Custom hooks | 4 files, 23 exported hooks (521 LOC) |
| Library modules | 5 files (652 LOC) |
| Routes | 7: `/`, `/dashboard`, `/proposals/[id]`, `/admin`, `/delegate`, `/activity`, `/_not-found` |
| Supported chains | 7: Sepolia, Arbitrum Sepolia, Base Sepolia, Arbitrum One, Base, Ethereum Mainnet, Hardhat |
| Wallet connectors | Injected (MetaMask, etc.) + WalletConnect v2 |
| Hardhat tests | 51 test cases across 3 files (28 + 13 + 10) |
| Compiler | Solidity 0.8.20, optimizer 200 runs |
| Framework | Next.js 14 App Router (all `"use client"` -- pure SPA) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
│                                                                     │
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐ ┌───────┐ ┌────────┐ │
│  │  page.tsx │ │ dashboard │ │ proposals/[id]│ │ admin │ │delegate│ │
│  └────┬─────┘ └─────┬─────┘ └──────┬───────┘ └───┬───┘ └───┬────┘ │
│       │             │              │              │         │       │
│  ┌────┴─────────────┴──────────────┴──────────────┴─────────┴────┐ │
│  │  Shared Components: Navbar, Footer, ConnectWallet, Toast,     │ │
│  │  ProposalCard, ResultsChart, ThemeProvider, ui/* (10 atoms)   │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
├──────────────────────────────┼──────────────────────────────────────┤
│                    CONNECTIVITY LAYER                               │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────────┐ │
│  │  Custom Hooks (23)                                            │ │
│  │  useVotingContract.ts  ·  useDelegation.ts                    │ │
│  │  useContractEvents.ts  ·  useTransactionToast.ts              │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────────┐ │
│  │  Wagmi v2 Config + Viem Transports                            │ │
│  │  lib/wagmi.ts  ·  lib/contracts.ts  ·  lib/chains.ts         │ │
│  │  Connectors: injected, walletConnect                          │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
├──────────────────────────────┼──────────────────────────────────────┤
│                     CONSENSUS LAYER (EVM)                           │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────────┐ │
│  │  VotingCore.sol (324 LOC)                                     │ │
│  │  AccessControl + Pausable + ReentrancyGuard                   │ │
│  │  Proposal lifecycle: Pending → Active → Closed                │ │
│  │  Role-gated registration, batch registration, voting          │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  VoteDelegation.sol (117 LOC)        VoterRegistry.sol (63)  │ │
│  │  Ownable · 1:1 delegation            Ownable · whitelist mgr │ │
│  │  Delegate profiles (URI)             Enumerable voter list    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  OpenZeppelin Contracts v5.0   ·   Solidity 0.8.20                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependency Graph

### Core Runtime

| Package | Version | Purpose |
|---|---|---|
| `next` | ^14.1.0 | App framework, SSR shell, App Router |
| `react` | ^18.2.0 | UI rendering |
| `react-dom` | ^18.2.0 | DOM bindings |

### Web3

| Package | Version | Purpose |
|---|---|---|
| `wagmi` | ^2.5.0 | React hooks for Ethereum (account, read/write contract, tx receipt) |
| `viem` | ^2.7.0 | TypeScript EVM client, ABI encoding, keccak256 |
| `@tanstack/react-query` | ^5.17.0 | Async state management (Wagmi peer dep) |

### UI

| Package | Version | Purpose |
|---|---|---|
| `framer-motion` | ^11.0.0 | Page transitions, AnimatedCard, StaggerContainer |
| `lucide-react` | ^0.312.0 | Icon set |
| `clsx` | ^2.1.0 | Conditional class names |
| `tailwind-merge` | ^2.2.0 | Tailwind class deduplication |

### Dev / Build

| Package | Version | Purpose |
|---|---|---|
| `hardhat` | ^2.19.4 | Smart contract compiler, test runner, local node |
| `@nomicfoundation/hardhat-toolbox` | ^4.0.0 | Ethers, Chai matchers, gas reporter, coverage |
| `@nomicfoundation/hardhat-network-helpers` | ^1.0.10 | `time.increase`, `loadFixture`, mining helpers |
| `@openzeppelin/contracts` | ^5.0.0 | AccessControl, Ownable, Pausable, ReentrancyGuard |
| `typescript` | ^5.3.0 | Type checking |
| `tailwindcss` | ^3.4.0 | Utility-first CSS |
| `postcss` | ^8.4.33 | CSS processing pipeline |
| `autoprefixer` | ^10.4.16 | Vendor prefix injection |
| `eslint` | ^8.56.0 | Linting |
| `eslint-config-next` | 14.1.0 | Next.js ESLint rules |
| `prettier` | ^3.2.0 | Code formatting |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Tailwind class sorting |
| `dotenv` | ^16.4.0 | Environment variable loading |
| `@types/node` | ^20.11.0 | Node.js type definitions |
| `@types/react` | ^18.2.0 | React type definitions |
| `@types/react-dom` | ^18.2.0 | ReactDOM type definitions |

---

## Component Inventory

| # | File | Purpose | LOC |
|---|---|---|---|
| 1 | `app/page.tsx` | Landing page -- hero, feature cards, CTA | 239 |
| 2 | `app/dashboard/page.tsx` | Voter dashboard -- proposal list, stats | 287 |
| 3 | `app/proposals/[id]/page.tsx` | Single proposal detail -- vote form, results chart, participation | 560 |
| 4 | `app/admin/page.tsx` | Admin panel -- create proposal, register voters, pause/unpause | 456 |
| 5 | `app/delegate/page.tsx` | Delegation UI -- set/remove delegate, delegate profile | 311 |
| 6 | `app/activity/page.tsx` | On-chain activity feed from contract events | 205 |
| 7 | `app/layout.tsx` | Root layout -- providers, Navbar, Footer wrapper | 75 |
| 8 | `app/providers.tsx` | WagmiProvider + QueryClientProvider + ThemeProvider | 34 |
| 9 | `app/error.tsx` | App-level error boundary | 57 |
| 10 | `app/loading.tsx` | Global loading skeleton | 13 |
| 11 | `app/not-found.tsx` | 404 page | 31 |
| 12 | `components/Navbar.tsx` | Top navigation bar with chain selector | 98 |
| 13 | `components/Footer.tsx` | Site footer with links | 102 |
| 14 | `components/ConnectWallet.tsx` | Wallet connect/disconnect button | 87 |
| 15 | `components/ProposalCard.tsx` | Proposal summary card for lists | 127 |
| 16 | `components/ResultsChart.tsx` | Yes/No/Abstain bar chart visualization | 105 |
| 17 | `components/ThemeProvider.tsx` | Dark/light theme context provider | 80 |
| 18 | `components/ThemeToggle.tsx` | Theme toggle button | 45 |
| 19 | `components/ui/Alert.tsx` | Alert/notification component | 50 |
| 20 | `components/ui/AnimatedCard.tsx` | Framer Motion card wrapper | 36 |
| 21 | `components/ui/Badge.tsx` | Status badge (success/warning/danger) | 53 |
| 22 | `components/ui/Button.tsx` | Base button with variants | 78 |
| 23 | `components/ui/Card.tsx` | Card container with header/body/footer | 95 |
| 24 | `components/ui/EmptyState.tsx` | Empty-data placeholder | 41 |
| 25 | `components/ui/Input.tsx` | Form input with label and error state | 108 |
| 26 | `components/ui/Skeleton.tsx` | Loading skeleton primitive | 19 |
| 27 | `components/ui/StaggerContainer.tsx` | Staggered animation wrapper for lists | 55 |
| 28 | `components/ui/Toast.tsx` | Toast notification system with tx hash links | 168 |

**Total: 3,615 LOC across 28 files**

---

## Hook Inventory

| # | Hook | File | Return Signature |
|---|---|---|---|
| 1 | `useProposalCount` | `useVotingContract.ts` | `{ data: bigint, isLoading, error }` |
| 2 | `useTotalRegisteredVoters` | `useVotingContract.ts` | `{ data: bigint, isLoading, error }` |
| 3 | `useIsPaused` | `useVotingContract.ts` | `{ data: boolean, isLoading, error }` |
| 4 | `useProposal` | `useVotingContract.ts` | `{ data: ProposalTuple, isLoading, error }` |
| 5 | `useProposals` | `useVotingContract.ts` | `{ proposals: ProposalView[], isLoading, error }` |
| 6 | `useParticipationRate` | `useVotingContract.ts` | `{ data: bigint (basis pts), isLoading, error }` |
| 7 | `useIsVoterRegistered` | `useVotingContract.ts` | `{ data: boolean, isLoading, error }` |
| 8 | `useHasVoted` | `useVotingContract.ts` | `{ data: boolean, isLoading, error }` |
| 9 | `useAccessRoles` | `useVotingContract.ts` | `{ isAdmin: boolean, isRegistrar: boolean, isLoading }` |
| 10 | `useCastVote` | `useVotingContract.ts` | `{ castVote, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 11 | `useCreateProposal` | `useVotingContract.ts` | `{ createProposal, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 12 | `useActivateProposal` | `useVotingContract.ts` | `{ activateProposal, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 13 | `useCloseProposal` | `useVotingContract.ts` | `{ closeProposal, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 14 | `useRegisterVoter` | `useVotingContract.ts` | `{ registerVoter, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 15 | `usePauseControls` | `useVotingContract.ts` | `{ pause, unpause, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 16 | `useMyDelegate` | `useDelegation.ts` | `{ data: address, isLoading, error }` |
| 17 | `useDelegateWeight` | `useDelegation.ts` | `{ data: bigint, isLoading, error }` |
| 18 | `useDelegateProfile` | `useDelegation.ts` | `{ data: string, isLoading, error }` |
| 19 | `useSetDelegate` | `useDelegation.ts` | `{ setDelegate, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 20 | `useRemoveDelegate` | `useDelegation.ts` | `{ removeDelegate, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 21 | `useSetDelegateProfile` | `useDelegation.ts` | `{ setProfile, hash, isPending, isConfirming, isSuccess, error, reset }` |
| 22 | `useRecentActivity` | `useContractEvents.ts` | `{ events: ActivityEvent[], isLoading, error }` |
| 23 | `useTransactionToast` | `useTransactionToast.ts` | `void (side-effect: manages toast lifecycle)` |

---

## Contract Storage Layout

### VotingCore.sol

```
Slot  Type                                        Variable
────  ──────────────────────────────────────────  ──────────────────────────────
 0    mapping(bytes32 => RoleData)                 _roles           (AccessControl)
 1    bool                                         _paused          (Pausable)
 2    bool                                         _entered         (ReentrancyGuard)
 3    mapping(uint256 => Proposal)                  proposals
 4    uint256                                       proposalCount
 5    mapping(address => Voter)                     voters           (private)
 6    uint256                                       totalRegisteredVoters
 7    mapping(uint256 => uint256)                   totalVotesOnProposal
```

**Proposal struct** (nested in `proposals` mapping):
```
Field          Type              Notes
─────────────  ────────────────  ─────────────────────────
id             uint256           1-indexed
title          string            dynamic
description    string            dynamic
yesVotes       uint256           incremented via castVote
noVotes        uint256           incremented via castVote
abstainVotes   uint256           incremented via castVote
state          ProposalState     enum: Pending(0), Active(1), Closed(2)
createdAt      uint256           block.timestamp at creation
activatedAt    uint256           block.timestamp at activation
closedAt       uint256           block.timestamp at close
deadline       uint256           0 = no deadline
```

### VoteDelegation.sol

```
Slot  Type                                        Variable
────  ──────────────────────────────────────────  ──────────────────────────────
 0    address                                      _owner           (Ownable)
 1    mapping(address => address)                   delegations
 2    mapping(address => uint256)                   delegatedWeight
 3    mapping(address => string)                    delegateProfiles
```

### VoterRegistry.sol

```
Slot  Type                                        Variable
────  ──────────────────────────────────────────  ──────────────────────────────
 0    address                                      _owner           (Ownable)
 1    mapping(address => bool)                      _registered      (private)
 2    address[]                                     _voterList       (private)
```

---

## Technical Debt Register

| # | Item | Severity | Effort to Fix |
|---|---|---|---|
| 1 | **No CI/CD pipeline** -- no `.github/workflows`, no Vercel config, no deployment automation | High | 2-4 hours |
| 2 | **No API routes** -- entire app is client-side; no server-side logic, rate limiting, or caching layer | Medium | Design decision, not necessarily debt |
| 3 | **No database / indexer** -- relies on direct RPC `getLogs` and `view` calls; activity page scans 5,000 blocks per load | High | 1-2 weeks (subgraph or Ponder) |
| 4 | **No monitoring** -- no Sentry, no error tracking, no uptime monitoring | High | 2-4 hours |
| 5 | **No analytics** -- no Google Analytics, Mixpanel, Plausible, or any usage tracking | Medium | 1-2 hours |
| 6 | **No email/notification system** -- voters are not notified of new proposals or results | Low | 1-2 weeks |
| 7 | **Console.log in error boundary** -- `app/error.tsx:17` contains `console.error()` | Low | 5 minutes |
| 8 | **No Dockerfile** -- no containerization for self-hosted deployments | Medium | 1-2 hours |
| 9 | **No `middleware.ts`** -- no auth gating, geo-blocking, rate limiting, or header injection | Medium | Context-dependent |
| 10 | **Hand-rolled ABI in `lib/contracts.ts`** -- 336 LOC of manually maintained ABI instead of using Hardhat artifact imports or codegen | Medium | 2-4 hours |
| 11 | **Event identification heuristic** -- `useContractEvents.ts` identifies events by topic prefix matching instead of proper ABI decoding | Medium | 1-2 hours |
| 12 | **VoterRegistry.sol `removeVoter` does not remove from `_voterList`** -- array grows monotonically; `getVoterCount` inflates over time | Low | 30 minutes |
| 13 | **No E2E tests** -- no Cypress, Playwright, or Synpress for frontend testing | High | 1-2 weeks |

---

## Risk Assessment Matrix

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **RPC provider outage** (Alchemy single-provider dependency) | M | H | Add fallback transports; configure Wagmi `fallback([http(primary), http(public)])` |
| 2 | **Admin key compromise** (DEFAULT_ADMIN_ROLE controls proposal lifecycle + pause) | L | H | Migrate to multisig (Safe) or timelock; separate REGISTRAR from ADMIN |
| 3 | **Frontrunning vote observation** (votes are plaintext on-chain) | H | M | Accept as design constraint or implement commit-reveal scheme |
| 4 | **Block reorg invalidates activity feed** (client reads finalized + pending) | M | L | Use `finalized` block tag for activity queries |
| 5 | **Contract upgrade impossible** (no proxy pattern deployed) | L | H | Deploy behind TransparentUpgradeableProxy if mutability is needed |
| 6 | **Gas spike during batch registration** (unbounded loop in `batchRegisterVoters`) | M | M | Add max-batch-size check (e.g., 200 addresses per tx) |
| 7 | **Stale contract address after redeployment** (hardcoded fallback in `lib/contracts.ts`) | M | H | Require env var; fail loudly if `NEXT_PUBLIC_CONTRACT_ADDRESS` is unset |
| 8 | **No rate limiting on RPC reads** (15s polling interval on `proposalCount`) | M | L | Batch reads with `useReadContracts`; increase poll interval on mainnet |
| 9 | **Voter privacy** (all votes are publicly attributable on-chain) | H | M | Document as known limitation; consider ZK voting in v3 |
| 10 | **No subgraph/indexer** (activity page scans 5,000 blocks via `getLogs`) | H | M | Deploy a Graph subgraph or Ponder indexer for historical queries |

---

## System Maturity

| Dimension | Score | Rationale |
|---|---|---|
| **Contracts** | 8/10 | Well-structured, custom errors, NatSpec docs, OpenZeppelin base, gas optimizations (unchecked, batch ops). Missing: proxy upgradeability, formal verification, batch size guard. |
| **Frontend** | 7/10 | Clean component hierarchy, reusable UI atoms, Framer Motion animations, theme support, CSV export. Missing: E2E tests, error boundaries per route, SSR/ISR optimization. |
| **Testing** | 7/10 | 51 Hardhat tests covering happy paths and reverts across all 3 contracts. Missing: frontend unit tests, E2E tests, fuzz testing, gas snapshot tests, coverage enforcement. |
| **Infrastructure** | 2/10 | Multi-chain RPC config exists via Alchemy. No CI/CD, no Docker, no Vercel config, no monitoring, no alerting. Deployment is manual via CLI scripts. |
| **Security** | 6/10 | AccessControl + Pausable + ReentrancyGuard on VotingCore. Custom errors reduce attack surface. Missing: multisig admin, timelock, formal audit, rate limiting, commit-reveal. |
| **DevOps** | 1/10 | No CI/CD pipeline, no automated deployment, no environment promotion (staging/prod), no infrastructure-as-code. Only manual `deploy:*` npm scripts exist. |
| **Documentation** | 4/10 | Solidity NatSpec is thorough. Frontend code is self-documenting with TypeScript. Missing: API docs, deployment runbook, architecture decision records, onboarding guide. |
| **Analytics** | 0/10 | Zero instrumentation. No usage analytics, no on-chain analytics dashboard, no funnel tracking, no performance monitoring (Web Vitals). |

### Composite Score: **4.4 / 10**

The protocol has a solid smart contract foundation and a functional frontend, but is critically lacking in infrastructure, DevOps, and observability. The highest-leverage improvements are: (1) CI/CD pipeline, (2) subgraph/indexer for historical data, (3) monitoring/alerting, and (4) E2E test suite.
