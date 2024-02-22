# iMaVote

> A blockchain-based e-voting protocol for transparent organizational governance.

## Motivation

Traditional voting systems rely on centralized infrastructure that can be tampered with, audited only by insiders, and lack real transparency. iMaVote leverages Ethereum smart contracts to provide a tamper-proof, publicly auditable voting mechanism where every ballot is permanently recorded on-chain.

## Goals

- **Immutability**: Once cast, a vote cannot be altered or deleted.
- **Transparency**: Tallying logic is open-source and verifiable by anyone.
- **Privacy**: Voter identity is separated from their ballot through address hashing.
- **Gas Efficiency**: Optimized storage patterns to keep participation costs low.

## System Architecture

```
┌───────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend (UI)   │────▶│  Wagmi / Viem    │────▶│  Ethereum Node  │
│   Next.js 14      │     │  Web3 Hooks      │     │  (JSON-RPC)     │
└───────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                   ┌───────▼────────┐
                                                   │ VotingCore.sol │
                                                   │ Registry.sol   │
                                                   └────────────────┘
```

## Smart Contract Design

### Voting.sol
The primary contract managing candidates and vote counting. Uses a simple but effective pattern:
- Admin registers candidates before the election.
- Each wallet address can vote exactly once.
- Vote counts are publicly readable at any time.

## Getting Started

### Prerequisites
- Node.js >= 18.17.0
- pnpm (recommended) or npm
- MetaMask or any EIP-1193 compatible wallet

### Installation
```bash
git clone https://github.com/itsaxay/imavote.git
cd imavote
pnpm install
```

### Compile & Test Contracts
```bash
npx hardhat compile
npx hardhat test
```

### Deploy Locally
```bash
npx hardhat node                                         # Terminal 1
npx hardhat run scripts/deploy.ts --network localhost    # Terminal 2
```

## Status

Core smart contract is functional with full test coverage. Next: refactor to enterprise-grade architecture with role-based access control.
