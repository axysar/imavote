# Product Roadmap

> Last updated: 2026-05-19

## Purpose

Sequence product development into time-boxed horizons, balancing user impact, engineering feasibility, and market timing. Each horizon builds on the previous — foundation → depth → scale → expansion.

## Assumptions

- Single engineering team (1-3 contributors) for the first 6 months.
- Open-source community contributions begin at ~200 GitHub stars.
- SaaS revenue enables hiring at ~$10K MRR.
- L2 deployment (Arbitrum/Base) is the primary production target.

---

## Now (Q2 2026) — Foundation ✅

**Theme**: Core product + production engineering + documentation.

| Deliverable | Status | Notes |
|---|---|---|
| VotingCore v2 (custom errors, deadlines, pagination, batch registration) | ✅ Done | 4 contracts, 51 tests |
| VoteDelegation contract (1:1 delegation, profiles, weight tracking) | ✅ Done | Separate contract for composability |
| VotingStrategies contract (equal, quadratic, capped, fixed) | ✅ Done | 4 strategies, ready for integration |
| Multi-chain support (7 chains: Sepolia, Arb Sepolia, Base Sepolia, Arbitrum, Base, Mainnet, Hardhat) | ✅ Done | Chain-aware UI via lib/chains.ts |
| Dashboard (search, filter, sort, CSV export) | ✅ Done | Real on-chain data, not mocks |
| Proposal detail page (vote flow, tally, sidebar) | ✅ Done | Yes/No/Abstain radio group |
| Admin panel (RBAC-gated: create, activate, close, register, pause) | ✅ Done | Role checked on-chain |
| Vote delegation page | ✅ Done | Set, switch, revoke delegation |
| Activity feed (contract events) | ✅ Done | Proper keccak256 event identification |
| Dark/light/system theme | ✅ Done | LocalStorage persistence |
| Toast notification system | ✅ Done | Transaction lifecycle feedback |
| CI/CD pipeline (GitHub Actions) | ✅ Done | lint → typecheck → test → build |
| Security middleware (CSP, HSTS, 6 headers) | ✅ Done | Wallet/RPC allowlist |
| API health endpoint | ✅ Done | Edge runtime |
| SEO (sitemap, robots.txt, metadata, OG tags) | ✅ Done | |
| PWA manifest | ✅ Done | Install-to-homescreen |
| Vercel deployment config | ✅ Done | Multi-region |
| Documentation suite (21 files) | ✅ Done | Architecture → strategy → execution |

## Next (Q3 2026) — Depth

**Theme**: Data infrastructure + advanced features + engagement.

| Deliverable | Priority | Dependencies | Effort |
|---|---|---|---|
| Subgraph / event indexer for instant queries | P0 | The Graph hosted service | 3 days |
| Wire VotingStrategies into VotingCore (strategy selection per proposal) | P0 | Strategy contract deployed | 2 days |
| Frontend test suite (Vitest for hooks + components) | P0 | None | 2 days |
| Delegate discovery page (`/delegates` directory) | P1 | Subgraph for delegate data | 2 days |
| Notification system (email opt-in for new proposals, deadline reminders) | P1 | API routes + email service | 3 days |
| Analytics dashboard page (`/analytics`) | P1 | Subgraph | 2 days |
| Slither static analysis in CI | P2 | None | 0.5 days |

## Later (Q4 2026) — Scale

**Theme**: Enterprise features + monetization + polish.

| Deliverable | Priority | Dependencies | Effort |
|---|---|---|---|
| Hosted SaaS offering (`imavote.xyz/create`) | P0 | API layer, multi-tenant | 5 days |
| Branded governance spaces (custom logo, colors, domain) | P1 | SaaS infrastructure | 3 days |
| Proposal templates (budget, election, parameter change) | P1 | None | 1 day |
| PDF ballot export for compliance | P1 | API route | 1 day |
| Lighthouse CI + performance optimization | P1 | GitHub Actions | 1 day |
| OG image generation for proposals (shareable vote cards) | P2 | Vercel OG | 1 day |
| Product Hunt launch | P0 | All of the above | 1 day |

## Future (2027+) — Expansion

**Theme**: Protocol-level innovation + ecosystem.

| Deliverable | Research Required | Complexity |
|---|---|---|
| ZK-private voting (commit-reveal with zero-knowledge proofs) | ZK circuit design | Very High |
| Sybil resistance (Gitcoin Passport / Worldcoin integration) | Identity protocol APIs | Medium |
| Gasless voting via meta-transactions (ERC-2771 relayer) | Relayer infrastructure | Medium |
| Cross-chain governance aggregation (unified results across L2s) | Bridge architecture | High |
| Mobile native app (React Native or PWA enhancement) | Mobile UX research | Medium |
| Plugin/extension ecosystem (community-built voting strategies) | Plugin API design | High |
| Governance token + protocol DAO (eat your own dogfood) | Tokenomics design | High |

---

## Decision Log

| Decision | Date | Rationale |
|---|---|---|
| Target L2 first (Arbitrum/Base) | 2026-05-19 | 100x cheaper gas makes voting accessible |
| Ship strategies contract before integration | 2026-05-19 | Validate math independently of VotingCore |
| Defer subgraph until Q3 | 2026-05-19 | Direct RPC reads work for <100 proposals; indexer adds infra complexity |
| Defer email notifications | 2026-05-19 | Requires email service + user preference storage; toast covers MVP |

## References

- Execution Plan: `docs/execution/EXECUTION_MASTER_PLAN.md`
- Pricing Strategy: `docs/strategy/PRICING_STRATEGY.md`
- Growth Strategy: `docs/strategy/GROWTH_STRATEGY.md`
