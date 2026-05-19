# Changelog

All notable changes to iMaVote are documented here.

## [Unreleased]

### Added
- CI/CD pipeline (GitHub Actions: lint, typecheck, contract test, build)
- Security middleware with CSP, HSTS, X-Frame-Options
- Proper event identification using keccak256 topic signatures (replaces brittle prefix matching)
- Documentation suite: architecture, market research, competitor analysis, user personas, pain points, product strategy, execution plan, security review, test strategy, KPIs, ADR log

### Fixed
- Activity feed event identification now uses viem's `encodeEventTopics` instead of hand-coded topic prefix matching

## [2.0.0] — 2026-05-19

### Added
- **Contracts**: VoteDelegation.sol with 1:1 delegation, weight tracking, delegate profiles
- **Contracts**: Locked pragma 0.8.20, zero-address validation, custom errors on all contracts
- **Frontend**: Vote delegation page (`/delegate`)
- **Frontend**: Activity feed page (`/activity`) with real-time contract event log
- **Frontend**: Dark/light/system theme with persistence (ThemeProvider + ThemeToggle)
- **Frontend**: Toast notification system for transaction lifecycle
- **Frontend**: CSV export for proposal data
- **Frontend**: Advanced sorting (newest/oldest/most votes/least votes)
- **Frontend**: Chain-aware block explorer links (Etherscan, Arbiscan, BaseScan)
- **Frontend**: Dynamic chain name display (replaces hardcoded "Sepolia")
- **Frontend**: PWA manifest for install-to-homescreen
- **Frontend**: Framer Motion animated cards and stagger containers
- **Infra**: Multi-chain support — Arbitrum, Base, Sepolia, mainnet (7 chains total)
- **Infra**: Multi-explorer verification (Etherscan, Arbiscan, BaseScan)
- **Tests**: 43 test cases across 3 contracts
- **Docs**: README with full architecture, API reference, and deployment guide

### Changed
- VotingCore upgraded to v2.0 with custom errors, deadlines, batch registration, pagination
- VoterRegistry migrated from revert strings to custom errors
- Deploy script now deploys VotingCore + VoteDelegation with seed data
- Dashboard reads real on-chain data (replaced mock data)
- Admin panel wired to contract writes with role gating
- Proposal detail page with full voting flow (Yes/No/Abstain radio group)

### Removed
- Legacy Voting.sol contract and tests
- Hardcoded mock proposal data
- Hardcoded Sepolia-only explorer links

## [1.0.0] — Initial

- Core VotingCore.sol contract with AccessControl, Pausable, ReentrancyGuard
- VoterRegistry.sol standalone whitelist
- Next.js 14 frontend with Tailwind CSS
- Wagmi v2 + Viem integration
- Basic dashboard, admin panel, and wallet connection
