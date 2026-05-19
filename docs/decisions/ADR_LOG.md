# Architecture Decision Records

## ADR-001: Lock Solidity pragma to 0.8.20

**Date**: 2026-05-19
**Status**: Accepted
**Context**: Floating pragma `^0.8.20` allows compilation with untested versions. Solidity 0.8.28 introduced a high-severity transient storage bug fixed in 0.8.34.
**Decision**: Lock all contracts to `pragma solidity 0.8.20`.
**Consequences**: Must explicitly upgrade pragma when moving to newer compiler features.

## ADR-002: Multi-chain support via chain metadata registry

**Date**: 2026-05-19
**Status**: Accepted
**Context**: Hardcoded Sepolia references throughout the frontend made the app single-chain.
**Decision**: Create `lib/chains.ts` as a single source of truth for chain metadata (names, explorer URLs, testnet flags). All UI reads from this registry.
**Consequences**: Adding a new chain requires one entry in `CHAIN_META` + wagmi config + hardhat config.

## ADR-003: Custom errors over revert strings

**Date**: 2026-05-19
**Status**: Accepted
**Context**: Revert strings cost ~200 gas per character stored. Custom errors are ~4x cheaper and provide structured data for frontend error mapping.
**Decision**: Use custom errors exclusively across all contracts.
**Consequences**: Frontend must decode custom error selectors for user-friendly messages.

## ADR-004: VoteDelegation as separate contract

**Date**: 2026-05-19
**Status**: Accepted
**Context**: Delegation could be embedded in VotingCore or kept separate.
**Decision**: Separate contract (`VoteDelegation.sol`) so it can be reused across multiple voting instances and upgraded independently.
**Consequences**: Two contract deployments required. Frontend needs two ABIs and addresses.

## ADR-005: Client-side only (no backend API)

**Date**: 2026-05-19
**Status**: Accepted (revisit in Phase 3)
**Context**: A backend adds complexity but enables notifications, indexing, and analytics.
**Decision**: Ship v2 as a pure client-side SPA reading directly from RPC. Plan backend via Next.js API routes in Phase 3.
**Consequences**: No notifications, no server-side caching, limited to RPC rate limits for data fetching.

## ADR-006: Security middleware with CSP

**Date**: 2026-05-19
**Status**: Accepted
**Context**: Default Next.js has no security headers. Wallet connectors require specific CSP exceptions.
**Decision**: Add `middleware.ts` with HSTS, CSP, X-Frame-Options, and explicit allowlist for RPC/WalletConnect domains.
**Consequences**: New RPC endpoints or wallet connectors must be added to CSP connect-src.
