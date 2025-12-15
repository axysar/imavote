# iMaVote

> Enterprise-grade decentralized e-voting protocol built on Ethereum.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

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
- [Roadmap](#roadmap)
- [License](#license)

---

## Motivation

Traditional voting systems rely on centralized infrastructure that can be tampered with, audited only by insiders, and lack real transparency. iMaVote leverages Ethereum smart contracts to provide a tamper-proof, publicly auditable voting mechanism where every ballot is permanently recorded on-chain.

### Core Principles

- **Immutability**: Once cast, a vote cannot be altered or deleted.
- **Universal Verifiability**: Any participant can independently verify the final tally.
- **Sovereign Identity**: Voters maintain full control over their cryptographic presence.
- **Gas Efficiency**: Optimized storage patterns and batched operations minimize costs.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                      │
│  Next.js 14 (App Router) + Tailwind CSS + Framer Motion       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Landing  │ │Dashboard │ │ Proposal │ │   Admin Panel    │  │
│  │  Page    │ │   View   │ │  Detail  │ │ (RBAC-gated)     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                       CONNECTIVITY LAYER                       │
│  Wagmi v2 + Viem + TanStack Query                             │
│  ┌──────────────────┐  ┌──────────────────────────────────┐   │
│  │  useVotingContract│  │  WagmiProvider + QueryClient    │   │
│  │  useCastVote     │  │  injected() + walletConnect()   │   │
│  │  useProposal     │  │                                  │   │
│  └──────────────────┘  └──────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│                         CONSENSUS LAYER                        │
│  Solidity 0.8.20 + OpenZeppelin 5.x                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  VotingCore.sol                                          │  │
│  │  ├── AccessControl (Admin, Registrar roles)              │  │
│  │  ├── Pausable (Emergency stop)                           │  │
│  │  ├── ReentrancyGuard (Attack prevention)                 │  │
│  │  ├── Proposal lifecycle (Pending → Active → Closed)      │  │
│  │  └── Vote casting with triple-selection (Yes/No/Abstain) │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  VoterRegistry.sol                                       │  │
│  │  └── Standalone whitelist with Ownable access            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Design

### VotingCore.sol

The primary contract managing proposals and vote counting. Uses a state-machine pattern with role-based access control.

#### Roles

| Role | Capability | Access |
|------|-----------|--------|
| `DEFAULT_ADMIN_ROLE` | Create/activate/close proposals, pause system | Contract deployer |
| `REGISTRAR_ROLE` | Register and deregister voters | Assigned by admin |
| Voter | Cast votes on active proposals | Registered addresses |

#### Proposal Lifecycle

```
  ┌─────────┐    activate()    ┌────────┐    close()    ┌────────┐
  │ Pending │ ──────────────▶ │ Active │ ────────────▶ │ Closed │
  └─────────┘                  └────────┘                └────────┘
                                 │
                           castVote()
```

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `createProposal(title, description)` | Admin | Creates a new proposal in Pending state |
| `activateProposal(id)` | Admin | Opens the proposal for voting |
| `closeProposal(id)` | Admin | Finalizes and locks the results |
| `castVote(proposalId, selection)` | Registered Voter | Casts a Yes (0), No (1), or Abstain (2) vote |
| `registerVoter(address)` | Registrar | Whitelists a wallet for participation |
| `getParticipationRate(proposalId)` | Public | Returns percentage of registered voters who voted |
| `pause()` / `unpause()` | Admin | Emergency stop for all voting activity |

#### Events

- `ProposalCreated(uint256 indexed id, string title)`
- `ProposalActivated(uint256 indexed id)`
- `ProposalClosed(uint256 indexed id, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)`
- `VoterRegistered(address indexed voter)`
- `VoteCast(address indexed voter, uint256 indexed proposalId, uint8 selection)`

### VoterRegistry.sol

A standalone registry contract managed by a single owner (Ownable). Provides `addVoter`, `removeVoter`, `isRegistered`, and enumeration functions.

---

## Frontend Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR, routing, server components |
| Styling | Tailwind CSS v3.4 | Utility-first design system |
| Components | Custom primitives (Card, Button, Badge) | Consistent UI language |
| Web3 | Wagmi v2 + Viem | Type-safe contract interactions |
| State | TanStack Query | Async data management |
| Animations | Framer Motion | Micro-interactions |
| Icons | Lucide React | Consistent iconography |
| Fonts | Inter (Google Fonts) | Modern typography |

### Component Structure

```
app/
├── layout.tsx              # Root layout with Providers + Navbar
├── providers.tsx           # WagmiProvider + QueryClientProvider
├── page.tsx                # Landing hero with live stats
├── dashboard/page.tsx      # Proposal grid with voting cards
└── admin/page.tsx          # Admin panel (create, register, pause)

components/
├── ui/
│   ├── Button.tsx          # Multi-variant button (primary/secondary/ghost/destructive)
│   ├── Card.tsx            # Glassmorphic container with header/content slots
│   └── Badge.tsx           # Status indicator (success/warning/danger)
├── ConnectWallet.tsx       # Wallet connection with address truncation
├── Navbar.tsx              # Fixed navigation with route links
├── ProposalCard.tsx        # Proposal summary with progress bar + vote actions
└── ResultsChart.tsx        # Stacked bar chart with legend

hooks/
└── useVotingContract.ts    # useProposalCount, useProposal, useCastVote

lib/
├── wagmi.ts                # Chain config with Sepolia + Hardhat + Mainnet
├── contracts.ts            # ABI + contract address constants
└── utils.ts                # cn(), truncateAddress(), formatVoteCount()
```

### Design Language

- **Dark-first**: Zinc-950 base with indigo/violet accent gradients
- **Glassmorphism**: `backdrop-blur-xl` + `bg-white/5` + subtle border opacity
- **Motion**: Framer Motion for page transitions and hover states
- **Responsive**: Mobile-first grid scaling to 3-column desktop layout

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.17.0
- **pnpm** (recommended) or npm
- **MetaMask** or any EIP-1193 compatible wallet

### Installation

```bash
git clone https://github.com/itsaxay/imavote.git
cd imavote
pnpm install
```

### Local Development

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Start Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Supported Networks

| Network | Chain ID | RPC | Status |
|---------|----------|-----|--------|
| Hardhat Local | 31337 | `http://127.0.0.1:8545` | ✅ Active |
| Sepolia Testnet | 11155111 | Alchemy / Infura | ✅ Active |
| Arbitrum One | 42161 | Public RPC | 🔜 Planned |
| Ethereum Mainnet | 1 | Alchemy / Infura | 🔜 Planned |

### Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

---

## Security

### Access Control

We use OpenZeppelin's `AccessControl` for role-based permissions:
- `DEFAULT_ADMIN_ROLE`: System-wide control (pause, propose, manage roles)
- `REGISTRAR_ROLE`: Voter registration and deregistration
- Standard voters interact through non-privileged `external` functions

### Attack Vectors Mitigated

1. **Reentrancy**: All state-mutating functions use `ReentrancyGuard`
2. **Double Voting**: `mapping(address => mapping(uint256 => bool))` prevents re-entry
3. **Overflow/Underflow**: Solidity 0.8.x provides built-in overflow checks
4. **Unauthorized Access**: Role-based modifiers on all admin/registrar functions

### Emergency Stop

The contract implements `Pausable`. When paused:
- No votes can be cast
- Proposals cannot be activated
- Existing data remains intact and readable
- Only `DEFAULT_ADMIN_ROLE` can pause/unpause

---

## Testing

### Smart Contract Tests

```bash
npx hardhat test                     # Run all tests
npx hardhat coverage                 # Generate coverage report
REPORT_GAS=true npx hardhat test    # Show gas consumption per function
```

### Test Coverage

| Contract | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| VotingCore.sol | 95% | 88% | 100% | 94% |
| VoterRegistry.sol | 100% | 100% | 100% | 100% |

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

## Roadmap

| Quarter | Milestone | Status |
|---------|-----------|--------|
| Q1 2024 | Core contract architecture + Hardhat tests | ✅ |
| Q2 2024 | OpenZeppelin migration + VoterRegistry | ✅ |
| Q3 2024 | Next.js 14 frontend + Tailwind design system | ✅ |
| Q4 2024 | Wagmi/Viem integration + wallet connectivity | ✅ |
| Q1 2025 | Admin panel + emergency controls | ✅ |
| Q2 2025 | Results visualization + utility library | ✅ |
| Q3 2025 | Commit-reveal voting scheme | 🔜 |
| Q4 2025 | Formal audit preparation | 🔜 |
| Q1 2026 | Production deployment on Arbitrum | 🔜 |

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

Built with conviction by **AxAy Labs AB** 🇸🇪
