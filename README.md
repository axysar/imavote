# iMaVote

> Enterprise-grade decentralized e-voting protocol built on Ethereum.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636)](https://soliditylang.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-v2-0096FA)](https://wagmi.sh/)

---

## Table of Contents

- [Motivation](#motivation)
- [System Architecture](#system-architecture)
- [Smart Contract Design](#smart-contract-design)
- [Frontend Architecture](#frontend-architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Security](#security)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [License](#license)

---

## Motivation

Traditional voting systems rely on centralized infrastructure that can be
tampered with, audited only by insiders, and lack real transparency. iMaVote
leverages Ethereum smart contracts to provide a tamper-proof, publicly
auditable voting mechanism where every ballot is permanently recorded
on-chain.

### Core Principles

- **Immutability** — Once cast, a vote cannot be altered or deleted.
- **Universal Verifiability** — Any participant can independently verify the
  final tally by reading public contract state.
- **Sovereign Identity** — Voters control their cryptographic presence; no
  centralized KYC or account system.
- **Gas Efficiency** — Custom errors, packed storage, and paginated reads keep
  transaction costs minimal.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                      │
│  Next.js 14 (App Router) · Tailwind CSS · Framer Motion       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Landing  │ │Dashboard │ │ Proposal │ │   Admin Panel    │  │
│  │  Page    │ │   View   │ │  Detail  │ │ (RBAC-gated)     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │Delegate  │ │ Activity │ │  Theme   │                       │
│  │  Page    │ │   Feed   │ │  Toggle  │                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
├────────────────────────────────────────────────────────────────┤
│                       CONNECTIVITY LAYER                       │
│  Wagmi v2 · Viem · TanStack Query · Toast System              │
│  ┌────────────────────────┐ ┌──────────────────────────────┐  │
│  │ useProposals           │ │ WagmiProvider + QueryClient  │  │
│  │ useCastVote            │ │ injected + walletConnect     │  │
│  │ useAccessRoles         │ │ ssr: true                    │  │
│  │ useDelegation          │ │ ToastProvider + ThemeProvider │  │
│  └────────────────────────┘ └──────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                         CONSENSUS LAYER                        │
│  Solidity 0.8.20 · OpenZeppelin 5.x                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  VotingCore.sol (v2.0)                                   │ │
│  │  ├── AccessControl (Admin, Registrar roles)              │ │
│  │  ├── Pausable (Emergency stop)                           │ │
│  │  ├── ReentrancyGuard (Attack prevention)                 │ │
│  │  ├── Custom errors + deadlines                           │ │
│  │  ├── Batch voter registration                            │ │
│  │  └── Paginated proposal reads                            │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  VoteDelegation.sol                                      │ │
│  │  └── 1:1 delegation, weight tracking, delegate profiles  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  VoterRegistry.sol (standalone whitelist, Ownable)       │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Design

### VotingCore.sol

The primary contract managing proposals and vote counting. Uses a
state-machine pattern, OpenZeppelin `AccessControl`, `Pausable`, and
`ReentrancyGuard`. Reverts use custom errors for cheaper gas and structured
error handling in the frontend.

#### Roles

| Role                 | Capability                                          | Assigned to     |
| -------------------- | --------------------------------------------------- | --------------- |
| `DEFAULT_ADMIN_ROLE` | Create/activate/close proposals, pause/unpause      | Deployer        |
| `REGISTRAR_ROLE`     | Register and deregister voters (single + batch)     | Admin           |
| Voter                | Cast votes on active proposals                      | Registered addr |

#### Proposal Lifecycle

```
  ┌─────────┐  activate()   ┌────────┐   close()    ┌────────┐
  │ Pending │ ────────────▶ │ Active │ ───────────▶ │ Closed │
  └─────────┘                └────────┘               └────────┘
                               │
                         castVote()
                         (respects deadline)
```

#### Key Functions

| Function                                          | Access    | Description                                  |
| ------------------------------------------------- | --------- | -------------------------------------------- |
| `createProposal(title, description, deadline)`    | Admin     | Creates proposal (Pending, optional deadline)|
| `activateProposal(id)`                            | Admin     | Opens the proposal for voting                |
| `closeProposal(id)`                               | Admin     | Finalizes and locks results                  |
| `castVote(proposalId, selection)`                 | Voter     | 0 = Yes, 1 = No, 2 = Abstain                 |
| `registerVoter(address)`                          | Registrar | Whitelists a single wallet                   |
| `batchRegisterVoters(address[])`                  | Registrar | Idempotent bulk registration                 |
| `deregisterVoter(address)`                        | Registrar | Removes a wallet from the whitelist          |
| `getProposals(offset, limit)`                     | Public    | Paginated proposal reader for frontends      |
| `getParticipationRate(proposalId)`                | Public    | Returns participation in basis points        |
| `hasVoted(voter, proposalId)`                     | Public    | Checks prior participation                   |
| `pause()` / `unpause()`                           | Admin     | Emergency stop                               |

#### Custom Errors

`AlreadyRegistered`, `NotRegistered`, `AlreadyVoted`, `InvalidSelection`,
`InvalidProposalId`, `WrongState`, `DeadlinePassed`, `DeadlineInPast`,
`EmptyTitle`. These are cheaper than revert strings and make it easy for the
UI to map failures into friendly messages.

#### Events

- `ProposalCreated(uint256 id, string title, address creator, uint256 deadline)`
- `ProposalActivated(uint256 id, uint256 activatedAt)`
- `ProposalClosed(uint256 id, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)`
- `VoterRegistered(address voter)` · `VoterDeregistered(address voter)`
- `VoteCast(address voter, uint256 proposalId, VoteOption selection)`

### VoteDelegation.sol

On-chain vote delegation registry. Allows registered voters to delegate
their voting power to a trusted representative (1:1 model). Delegates
accumulate weight that the frontend reads for display. Supports:

- `setDelegate(address)` — delegate your vote (auto-removes previous)
- `removeDelegate()` — revoke delegation, vote independently again
- `getWeight(address)` — total addresses delegating to a given delegate
- `setProfile(string)` — set an IPFS/HTTP profile URI for delegate discovery
- Custom errors: `CannotDelegateToSelf`, `NoDelegationSet`, `AlreadyDelegatedTo`

### VoterRegistry.sol

A standalone registry contract managed by a single owner (`Ownable`).
Provides `addVoter`, `removeVoter`, `isRegistered`, and enumeration. Used as
an optional external allow-list when VotingCore's built-in registry is not a
good fit (e.g. shared across multiple voting contracts).

---

## Frontend Architecture

### Tech Stack

| Layer       | Technology                                 | Purpose                                |
| ----------- | ------------------------------------------ | -------------------------------------- |
| Framework   | Next.js 14 (App Router)                    | SSR, routing, server components        |
| Styling     | Tailwind CSS v3.4 + custom design tokens   | Utility-first dark-mode design system  |
| Components  | In-house primitives (Button/Card/Badge/…)  | Consistent, typed UI language          |
| Web3        | Wagmi v2 + Viem                            | Type-safe contract reads & writes      |
| State       | TanStack Query                             | Async caching, background refetching   |
| Icons       | Lucide React                               | Consistent iconography                 |
| Fonts       | Inter (Google Fonts) with font variable    | Modern typography                      |

### Routes

| Route                 | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `/`                   | Marketing landing with live on-chain stats                    |
| `/dashboard`          | Searchable, filterable, sortable proposal grid + CSV export   |
| `/proposals/[id]`     | Proposal detail with tally, metadata, and voting UI           |
| `/delegate`           | Vote delegation management (set, switch, revoke)              |
| `/activity`           | Real-time event feed from contract logs                       |
| `/admin`              | RBAC-gated admin panel (create, register, activate, pause)    |

### Component Structure

```
app/
├── layout.tsx                 # Root layout · Providers · Navbar · Footer
├── providers.tsx              # Wagmi + Query + Toast + Theme providers
├── error.tsx                  # Global error boundary
├── loading.tsx                # Global loading fallback
├── not-found.tsx              # 404 page
├── page.tsx                   # Landing hero + features + CTA
├── dashboard/page.tsx         # Proposal grid (search / filter / sort / export)
├── proposals/[id]/page.tsx    # Proposal detail + vote flow + Etherscan link
├── delegate/page.tsx          # Vote delegation management
├── activity/page.tsx          # Real-time contract event feed
└── admin/page.tsx             # Gated admin panel

components/
├── ui/
│   ├── Button.tsx             # Variants, sizes, loading state, a11y focus
│   ├── Card.tsx               # Header/Title/Description/Content/Footer
│   ├── Badge.tsx              # default/success/warning/danger/info
│   ├── Input.tsx              # Input + Textarea with label/helper/error
│   ├── Skeleton.tsx           # Loading placeholder
│   ├── EmptyState.tsx         # Empty/no-data pattern
│   ├── Alert.tsx              # Inline status callouts
│   ├── Toast.tsx              # ToastProvider + useToast for tx feedback
│   ├── AnimatedCard.tsx       # Framer Motion card with stagger entrance
│   └── StaggerContainer.tsx   # Stagger animation wrapper
├── ConnectWallet.tsx          # Connect + address dropdown with chain id
├── Navbar.tsx                 # Fixed nav + mobile menu + theme toggle
├── ThemeProvider.tsx           # Dark/light/system with localStorage
├── ThemeToggle.tsx            # Compact theme switcher (sun/moon/monitor)
├── Footer.tsx                 # Footer with sitemap + attribution
├── ProposalCard.tsx           # Proposal summary + skeleton
└── ResultsChart.tsx           # Stacked bar + legend, a11y-labelled

hooks/
├── useVotingContract.ts       # Complete read/write hook suite
├── useDelegation.ts           # Delegation read/write hooks
├── useContractEvents.ts       # Live event feed from contract logs
└── useTransactionToast.ts     # Auto-toast for tx lifecycle

lib/
├── wagmi.ts                   # SSR-safe config, Sepolia + Hardhat + Mainnet
├── contracts.ts               # ABI + address + enums + TS types (both contracts)
├── utils.ts                   # cn(), truncateAddress(), time/pct helpers
└── export.ts                  # CSV export + Etherscan URL helpers
```

### Design Language

- **Dark-first.** Zinc-950 base with indigo/violet accent gradients.
- **Glassmorphism.** `backdrop-blur-xl` surfaces with subtle ring borders.
- **Typography.** Inter with italic, tracking-tighter display headlines.
- **Theme.** Dark/light/system with localStorage persistence + live toggle.
- **Motion.** Fade-in on route change, stagger animations, `prefers-reduced-motion` respected.
- **Toast system.** Global notification queue for transaction lifecycle feedback.
- **Accessibility.** Focus rings, aria-live, skip link, labelled SVGs, radiogroups.
- **PWA.** Web app manifest for install-to-homescreen on mobile.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17.0
- **pnpm** (recommended) or npm
- **MetaMask**, **Rabby**, or any EIP-1193 compatible wallet

### Installation

```bash
git clone https://github.com/axysar/imavote.git
cd imavote
pnpm install
cp .env.example .env.local
```

### Local Development (end-to-end in 3 terminals)

```bash
# Terminal 1 — local EVM node
pnpm node:local

# Terminal 2 — compile + deploy VotingCore and seed demo proposals/voters
pnpm deploy:local

# Terminal 3 — Next.js dev server
pnpm dev
```

Open <http://localhost:3000>. The deploy script seeds two proposals (one
active) and registers the first five Hardhat signers as voters, so the
dashboard and voting flow are immediately interactive.

> The deploy script writes `deployments/<network>.json` with the contract
> address; wire that into `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

---

## Deployment

### Supported Networks

| Network        | Chain ID | RPC                          | Status    |
| -------------- | -------- | ---------------------------- | --------- |
| Hardhat Local  | 31337    | `http://127.0.0.1:8545`      | ✅ Active |
| Sepolia        | 11155111 | Alchemy / public             | ✅ Active |
| Arbitrum One   | 42161    | Public RPC                   | 🔜 Planned|
| Mainnet        | 1        | Alchemy                      | 🔜 Planned|

### Deploy to Sepolia

```bash
# 1. Fill PRIVATE_KEY and NEXT_PUBLIC_ALCHEMY_KEY in .env.local
pnpm deploy:sepolia

# 2. The script automatically attempts `hardhat verify` on Etherscan
#    (requires ETHERSCAN_API_KEY).
```

---

## Security

### Access Control

- `DEFAULT_ADMIN_ROLE` — full lifecycle control: proposals, roles, pause
- `REGISTRAR_ROLE` — voter registration / deregistration (single + batch)
- Voters interact through non-privileged `external` functions

### Attack Vectors Mitigated

1. **Reentrancy** — `castVote` guarded by `nonReentrant`
2. **Double voting** — per-proposal `mapping(address ⇒ bool)` + `AlreadyVoted`
3. **Overflow/underflow** — Solidity 0.8.x built-in checks + `unchecked` only
   where provably safe
4. **Unauthorized access** — custom errors + role modifiers on every mutating
   function
5. **Deadline enforcement** — on-chain timestamp check rejects late votes
6. **Invalid state transitions** — `WrongState` reverts block double
   activate/close

### Emergency Stop

The contract implements `Pausable`. When paused:

- No votes can be cast (`whenNotPaused`)
- Existing data remains readable
- Only `DEFAULT_ADMIN_ROLE` can toggle the state

---

## Testing

```bash
pnpm test                 # Run the full Hardhat test suite
pnpm test:coverage        # Solidity coverage report
pnpm test:gas             # Gas usage report per function
pnpm typecheck            # TypeScript typecheck (frontend)
pnpm lint                 # Next.js ESLint
```

### Coverage Targets

| Contract           | Statements | Branches | Functions | Lines |
| ------------------ | ---------- | -------- | --------- | ----- |
| VotingCore.sol     | 98%        | 92%      | 100%      | 97%   |
| VoteDelegation.sol | 100%       | 100%     | 100%      | 100%  |
| VoterRegistry.sol  | 100%       | 100%     | 100%      | 100%  |

39 tests exercise registration, lifecycle, vote casting, deadlines,
pagination, participation math, emergency pause, delegation weight,
delegate profiles, and every custom error.

---

## Environment Variables

Create a `.env.local` file in the project root (see `.env.example`):

```env
# Public (exposed to client)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Private (server-side only)
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

## Scripts

| Script                  | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `pnpm dev`              | Start the Next.js dev server                        |
| `pnpm build`            | Production build                                    |
| `pnpm start`            | Serve the production build                          |
| `pnpm lint`             | ESLint (Next config)                                |
| `pnpm typecheck`        | `tsc --noEmit`                                      |
| `pnpm compile`          | Compile Solidity contracts                          |
| `pnpm test`             | Hardhat test suite                                  |
| `pnpm test:coverage`    | Solidity coverage report                            |
| `pnpm test:gas`         | Gas report via hardhat-gas-reporter                 |
| `pnpm node:local`       | Spin up a local Hardhat JSON-RPC node               |
| `pnpm deploy:local`     | Deploy + seed VotingCore on the local node          |
| `pnpm deploy:sepolia`   | Deploy to Sepolia + Etherscan verify                |
| `pnpm clean`            | Remove build artifacts                              |

---

## Roadmap

| Quarter  | Milestone                                         | Status |
| -------- | ------------------------------------------------- | ------ |
| Q1 2024  | Core contract architecture + Hardhat tests        | ✅     |
| Q2 2024  | OpenZeppelin 5 migration + VoterRegistry          | ✅     |
| Q3 2024  | Next.js 14 frontend + Tailwind design system      | ✅     |
| Q4 2024  | Wagmi/Viem integration + wallet connectivity      | ✅     |
| Q1 2025  | Admin panel + emergency controls                  | ✅     |
| Q2 2025  | Results visualization + utility library           | ✅     |
| Q3 2025  | Proposal detail + deadlines + custom errors       | ✅     |
| Q4 2025  | Vote delegation contract + UI                     | ✅     |
| Q1 2026  | Theme system, toast notifications, activity feed  | ✅     |
| Q2 2026  | CSV export, sorting, PWA, Framer Motion           | ✅     |
| Q3 2026  | Formal audit preparation                          | 🔜     |
| Q4 2026  | Commit-reveal voting + Arbitrum deployment        | 🔜     |

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

Built with conviction by **AxAy Labs AB**
