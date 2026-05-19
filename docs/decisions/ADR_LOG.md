# Architecture Decision Records

> Last updated: 2026-05-19

## Purpose

Document every significant architectural decision with context, rationale, and consequences. ADRs are immutable once accepted — superseded decisions are marked as such, never deleted.

---

## ADR-001: Lock Solidity pragma to 0.8.20

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Floating pragma `^0.8.20` allows compilation with untested versions. Solidity 0.8.28 introduced a high-severity transient storage clearing bug (fixed in 0.8.34). Production contracts must compile deterministically.

**Decision**: Lock all contracts to `pragma solidity 0.8.20`.

**Consequences**: Must explicitly upgrade pragma when adopting newer compiler features (e.g., transient storage in 0.8.28+). Requires re-auditing after any pragma bump.

**References**: [Solidity 0.8.34 bugfix release](https://soliditylang.org/blog/category/releases/)

---

## ADR-002: Multi-chain support via chain metadata registry

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Hardcoded Sepolia references throughout the frontend made the app single-chain. Users need to deploy on Arbitrum, Base, and other L2s where gas is 100x cheaper.

**Decision**: Create `lib/chains.ts` as a single source of truth for chain metadata (names, explorer URLs, testnet flags). All UI components read from this registry. Wagmi config supports 7 chains.

**Consequences**: Adding a new chain requires one entry in `CHAIN_META` + wagmi transport + hardhat network config. No frontend code changes needed.

---

## ADR-003: Custom errors over revert strings

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Revert strings cost ~200 gas per character stored on-chain. Custom errors (Solidity 0.8.4+) are ~4x cheaper and provide structured data (error selector + typed parameters) for frontend error mapping.

**Decision**: Use custom errors exclusively across all 4 contracts. 14 custom errors defined.

**Consequences**: Frontend must decode custom error selectors for user-friendly messages. Legacy tools that only parse revert strings won't display meaningful errors.

---

## ADR-004: VoteDelegation as separate contract

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Delegation could be embedded in VotingCore or kept as a standalone contract.

**Decision**: Separate contract (`VoteDelegation.sol`) with its own deployment and ABI. Delegates weight, profiles, and set/remove operations are independent of voting logic.

**Rationale**:
- Reusable across multiple VotingCore instances
- Independently upgradeable without redeploying voting logic
- Smaller contract size (avoids EIP-170 limit pressure)
- Cleaner separation of concerns

**Consequences**: Two contract deployments required. Frontend needs two ABIs, two addresses, and two hook files.

---

## ADR-005: Client-side only architecture (no backend API)

**Date**: 2026-05-19 | **Status**: Accepted (revisit Q3 2026)

**Context**: A backend API enables notifications, indexing, analytics, and caching. But it adds infrastructure complexity, hosting costs, and security surface area.

**Decision**: Ship v2 as a pure client-side SPA. All data reads go directly to RPC via Wagmi/Viem. One API route exists (`/api/health`) for monitoring.

**Consequences**:
- No email/push notifications (toast only)
- No server-side caching (RPC rate limits apply)
- No subgraph (polling with getLogs instead)
- Activity feed is slower than indexed alternatives
- Will revisit when subgraph or notification system is needed

---

## ADR-006: Security middleware with Content Security Policy

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Default Next.js has no security headers. Wallet connectors (WalletConnect, MetaMask) require specific CSP exceptions for their relay domains.

**Decision**: Add `middleware.ts` with 6 security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). CSP explicitly allowlists Alchemy, Infura, WalletConnect relay, and L2 RPCs.

**Consequences**: New RPC endpoints, wallet connectors, or third-party scripts must be added to the CSP allowlist. Forgetting this causes silent connection failures.

---

## ADR-007: VotingStrategies as a pure function library

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Advanced voting strategies (quadratic, weighted, capped) need to be available to VotingCore without complicating its storage or upgrade path.

**Decision**: Deploy `VotingStrategies.sol` as a stateless library contract. All functions are `pure` — they take inputs and return weights without reading or writing storage. VotingCore will call these via `staticcall` when strategy integration is wired up.

**Rationale**:
- Stateless = no storage collision risk
- Pure functions = gas efficient (no SLOAD)
- Independently deployable and testable
- Easy to extend without redeploying VotingCore

**Consequences**: Strategy selection per proposal requires a VotingCore upgrade to store a `strategyId` per proposal and call the strategies contract. This is planned for Q3 2026.

---

## ADR-008: Vercel as primary deployment target

**Date**: 2026-05-19 | **Status**: Accepted

**Context**: Frontend needs hosting with Edge Functions, automatic HTTPS, preview deployments, and zero-config Next.js support.

**Decision**: Configure `vercel.json` for multi-region deployment (US, EU, Singapore). Use Edge Runtime for the health endpoint. Middleware runs at the edge for minimal latency on security headers.

**Consequences**: Vercel-specific features (Edge Runtime, ISR) are used. Alternative deployment (Netlify, self-hosted) requires minor config changes but no code changes.

---

## Decision Index

| ADR | Topic | Status | Impact |
|---|---|---|---|
| 001 | Locked pragma | Accepted | Security |
| 002 | Chain metadata registry | Accepted | Architecture |
| 003 | Custom errors | Accepted | Gas + DX |
| 004 | Separate delegation contract | Accepted | Architecture |
| 005 | Client-side only | Accepted (revisit Q3) | Architecture |
| 006 | CSP middleware | Accepted | Security |
| 007 | Stateless strategies library | Accepted | Architecture |
| 008 | Vercel deployment | Accepted | Infrastructure |
