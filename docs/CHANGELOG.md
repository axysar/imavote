# Changelog

All notable changes to iMaVote are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- VotingStrategies.sol: pluggable vote weight library (equal, quadratic, capped, fixed) with 8 tests
- API health endpoint (`/api/health`) on Edge Runtime
- Vercel deployment config (`vercel.json`) with multi-region support
- Pricing strategy documentation with 4-tier model
- Deployment guide with per-network commands and post-deploy checklist
- Phase 1 retrospective document
- SEO: `sitemap.ts`, `robots.txt`, preconnect hints for RPC domains
- NetworkBadge component showing connected chain in navbar
- Security middleware (`middleware.ts`) with CSP, HSTS, X-Frame-Options, 6 headers total
- CI/CD pipeline (`.github/workflows/ci.yml`): lint → typecheck → contract test + gas → build
- Documentation suite: 21 files across architecture, research, competitors, users, strategy, execution, analytics, security, performance, testing, decisions, deployment, retrospectives

### Fixed
- Activity feed event identification: replaced brittle topic-prefix matching with proper keccak256 signature lookup via viem `encodeEventTopics`
- Hardcoded Sepolia Etherscan links replaced with chain-aware `getExplorerAddressUrl()` / `getExplorerTxUrl()`
- Landing page "Now live on Sepolia" replaced with dynamic `"Live on {chainMeta.name}"`

### Changed
- Dashboard badge shows connected chain name instead of generic "Live on-chain"
- Test count: 51 (was 43 — added VotingStrategies + zero-address tests)

## [2.1.0] — 2026-05-19

### Added
- **Contracts**: VoteDelegation.sol — 1:1 non-custodial delegation, weight tracking, delegate profiles, custom errors
- **Contracts**: Locked pragma `0.8.20` on all contracts, zero-address validation with `ZeroAddress` custom error
- **Contracts**: VoterRegistry migrated from revert strings to custom errors (AlreadyRegistered, NotRegistered, ZeroAddress, OutOfBounds)
- **Frontend**: Vote delegation page (`/delegate`) — set, switch, revoke delegation with status cards
- **Frontend**: Activity feed page (`/activity`) — real-time contract event log with block numbers and tx links
- **Frontend**: Dark/light/system theme with localStorage persistence (ThemeProvider + ThemeToggle)
- **Frontend**: Toast notification system (ToastProvider + useToast) for transaction lifecycle feedback
- **Frontend**: CSV export for proposal data on dashboard
- **Frontend**: Advanced sorting (newest/oldest/most votes/least votes)
- **Frontend**: Chain-aware block explorer links (Etherscan, Arbiscan, BaseScan)
- **Frontend**: PWA manifest for install-to-homescreen
- **Frontend**: Framer Motion animated cards and stagger containers
- **Infra**: Multi-chain support — Arbitrum One, Arbitrum Sepolia, Base, Base Sepolia added (7 chains total)
- **Infra**: Multi-explorer verification (Etherscan, Arbiscan, BaseScan API keys)
- **Infra**: Deploy scripts for all networks (`deploy:arb-sepolia`, `deploy:base-sepolia`, `deploy:arbitrum`, `deploy:base`)
- **Tests**: VoteDelegation tests (10 cases), VoterRegistry custom error tests, VotingCore zero-address test

## [2.0.0] — 2026-05-19

### Added
- VotingCore v2.0: custom errors (10 errors), voting deadlines, batch voter registration, paginated `getProposals`, `hasVoted` view, participation rate in basis points
- Dashboard with real on-chain data, search, state filters (All/Active/Pending/Closed)
- Proposal detail page (`/proposals/[id]`) with vote radio group (Yes/No/Abstain), participation bar, metadata sidebar, status checklist
- Admin panel wired to contract writes with on-chain RBAC gating (DEFAULT_ADMIN_ROLE, REGISTRAR_ROLE)
- Proposal lifecycle management (create → activate → close) in admin panel
- Emergency pause/resume controls
- Complete hook suite: useProposals, useCastVote, useAccessRoles, useCreateProposal, etc.
- Button: variants, sizes, forwardRef, isLoading/loadingText, focus rings
- Card: interactive variant, CardFooter
- Badge: info variant, optional status dot
- Input, Textarea, Skeleton, EmptyState, Alert UI primitives
- ResultsChart: accessible role=img, sizes, zero-state handling
- Landing page: live stats, features grid, lifecycle diagram
- Navbar: active-route indicator, mobile hamburger menu
- ConnectWallet: dropdown with chain ID, disconnect
- Footer component with sitemap
- Error boundary (error.tsx), not-found page, loading fallback
- Skip-to-content link, reduced-motion support
- React Query defaults (staleTime, gcTime, retry)
- Wagmi SSR mode

### Changed
- Deploy script deploys VotingCore (not legacy Voting.sol), seeds demo data on local
- Hardhat config with Sepolia + localhost networks, dotenv, gas reporter

### Removed
- Legacy Voting.sol contract and tests (superseded by VotingCore)
- Hardcoded mock proposal data on dashboard
- Hardcoded address slicing (replaced with `truncateAddress` utility)

## [1.0.0] — Initial

- Core VotingCore.sol contract with AccessControl, Pausable, ReentrancyGuard
- VoterRegistry.sol standalone whitelist
- Next.js 14 frontend with Tailwind CSS
- Wagmi v2 + Viem integration
- Basic dashboard, admin panel, and wallet connection
