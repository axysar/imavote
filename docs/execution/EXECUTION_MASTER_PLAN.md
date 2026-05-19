# Execution Master Plan — 10 Phases

> Last updated: 2026-05-19
> Status: Active execution

## Overview

Transform iMaVote from a functional prototype into a production-grade, globally competitive governance platform through 10 systematic phases.

**Current state**: 3 smart contracts, 7 frontend routes, 43 tests, 7 chain support, no backend, no CI/CD, no analytics.

**Target state**: Production SaaS with subgraph indexing, CI/CD, monitoring, comprehensive testing, enterprise features, and a hosted deployment option.

---

## Phase 1: CI/CD Pipeline & DevOps Foundation

**Goal**: Zero-to-production deployment infrastructure.

**Rationale**: No code improvement matters if we can't reliably build, test, and deploy. DevOps is the foundation everything else depends on.

**Scope**:
- GitHub Actions workflow: lint → typecheck → contract compile → hardhat test → next build
- Automatic PR checks (fail-on-error)
- Vercel/Netlify deployment config for frontend
- Hardhat deployment verification scripts
- Branch protection rules documentation

**Implementation**:
- `.github/workflows/ci.yml` — full CI pipeline
- `.github/workflows/deploy.yml` — deployment on merge to main
- `vercel.json` or `netlify.toml` — hosting config

**Success Metrics**: Every PR runs CI, builds succeed on merge, deployment is automatic.

**KPIs**: Build time < 3 min, test pass rate 100%, zero manual deployments.

---

## Phase 2: Subgraph / Event Indexing Layer

**Goal**: Replace direct RPC reads with an indexed data layer for performance and reliability.

**Rationale**: Current architecture reads every proposal via individual RPC calls. At 100+ proposals this becomes slow and rate-limited. A subgraph or indexer provides instant queries, historical data, and real-time subscriptions.

**Scope**:
- The Graph subgraph for VotingCore + VoteDelegation events
- Subgraph schema: Proposal, Vote, Voter, Delegation entities
- Replace useProposals polling with subgraph queries
- Activity feed powered by indexed events (not getLogs)

**Architecture Change**: Add `subgraph/` directory with schema.graphql, mappings, subgraph.yaml.

**Success Metrics**: Dashboard loads in < 500ms regardless of proposal count.

---

## Phase 3: API Layer & Middleware

**Goal**: Server-side capabilities for features that can't be purely client-side.

**Rationale**: Notifications, analytics, and enterprise features require a backend. Next.js API routes provide this without a separate server.

**Scope**:
- `app/api/` routes for: proposal webhooks, CSV export (server-side), health check
- `middleware.ts` for: rate limiting, bot detection, CSP headers
- Server-side proposal metadata caching (Redis or in-memory)

**Security Implications**: API routes must validate signatures; no admin actions without wallet proof.

---

## Phase 4: Comprehensive Testing & Security Hardening

**Goal**: Audit-ready contract security and frontend test coverage.

**Rationale**: Smart contracts are immutable once deployed. Every bug is permanent. Frontend tests prevent regressions as we ship faster.

**Scope**:
- Contract: fuzz testing with Echidna/Foundry, invariant tests, gas optimization benchmarks
- Frontend: Vitest unit tests for hooks, component tests for critical flows
- Security: Slither static analysis, documented threat model
- `docs/security/SECURITY_REVIEW.md` — full security assessment
- `docs/testing/TEST_STRATEGY.md` — test pyramid documentation

**Success Metrics**: 95%+ contract branch coverage, 0 Slither high/medium findings, 80%+ frontend hook coverage.

---

## Phase 5: Advanced Voting Strategies

**Goal**: Move beyond Yes/No/Abstain to support real governance needs.

**Rationale**: Research shows quadratic voting adoption up 30%, conviction voting gaining traction. Single-choice voting is table stakes — advanced strategies are a differentiator.

**Scope**:
- New contract: `VotingStrategies.sol` — modular voting type registry
- Weighted voting (token-balance-based vote weight)
- Ranked choice voting
- Quadratic voting (with Sybil resistance integration point)
- Approval voting (vote for multiple options)
- Frontend: voting type selector in proposal creation, dynamic vote UI per type

**Risk**: Quadratic voting requires identity layer for Sybil resistance. Ship without identity first, document the integration point for Gitcoin Passport.

---

## Phase 6: Notification & Engagement System

**Goal**: Push participation from 17% toward 50%+ by eliminating "I missed it" as a failure mode.

**Rationale**: Research shows each notification reminder increases turnout by ~5%. No governance platform does notifications well.

**Scope**:
- In-app notification bell with unread count
- Email notification opt-in (proposal created, voting deadline approaching, vote confirmed)
- Browser push notifications via Service Worker
- Telegram/Discord webhook integration for DAO channels

**Architecture**: New `app/api/notifications/` routes, user preference storage (localStorage for MVP, database for SaaS).

---

## Phase 7: Delegate Discovery & Profiles

**Goal**: Make delegation a first-class feature, not an afterthought.

**Rationale**: Tally proved delegation boosts participation 20%+. But delegate discovery is still primitive — no profiles, no track records, no accountability.

**Scope**:
- `/delegates` page — browsable directory of delegates with profiles
- Delegate profile page — statement, voting history, delegation weight, participation rate
- On-chain profile URI (already in VoteDelegation.sol) connected to IPFS/Arweave metadata
- Delegation leaderboard
- "Recommended delegates" based on voting alignment

**Success Metrics**: 30%+ of registered voters use delegation.

---

## Phase 8: Analytics & Observability

**Goal**: Data-driven governance with full operational visibility.

**Rationale**: Zero analytics means zero insight into what's working. Operators need dashboards; product needs metrics.

**Scope**:
- `/analytics` page — participation trends, voter demographics, proposal outcomes over time
- Operator dashboard — gas costs, contract interactions, error rates
- Sentry integration for frontend error tracking
- Structured logging (replace console.log)
- `docs/analytics/KPIS.md` — metric definitions and targets

**Success Metrics**: Every page load, vote cast, and error is tracked. Dashboard shows 30-day trends.

---

## Phase 9: Enterprise & Compliance Features

**Goal**: Make iMaVote viable for non-crypto organizations.

**Rationale**: The biggest underserved market is associations, co-ops, and enterprises that need governance but find existing tools either too crypto or too expensive.

**Scope**:
- Branded governance spaces (custom logo, colors, domain)
- Compliance-ready audit trail (exportable, timestamped, signed)
- Role hierarchy (Admin → Registrar → Voter → Observer)
- Proposal templates (budget approval, board election, bylaw amendment)
- PDF ballot export for legal compliance
- Privacy mode (encrypted votes with ZK reveal — research phase)

---

## Phase 10: Performance, Polish & Launch

**Goal**: Ship a globally competitive product.

**Rationale**: The difference between a prototype and a product is polish, performance, and reliability.

**Scope**:
- Lighthouse score > 90 on all routes
- Bundle analysis and code splitting (dynamic imports for heavy components)
- Image optimization (OG images, favicons, app icons)
- SEO: metadata, sitemap, robots.txt
- Comprehensive README rewrite with quickstart video
- Product Hunt launch preparation
- `docs/CHANGELOG.md` — full release history
- Load testing (100 concurrent voters)

**Success Metrics**: Lighthouse 90+, FCP < 1.5s, TTI < 3s, zero console errors in production.

---

## Execution Timeline

| Phase | Duration | Dependencies | Priority |
|---|---|---|---|
| 1. CI/CD | 1 day | None | P0 |
| 2. Indexing | 2 days | Phase 1 | P0 |
| 3. API Layer | 1 day | Phase 1 | P1 |
| 4. Testing | 2 days | Phase 1 | P0 |
| 5. Voting Strategies | 3 days | Phase 4 | P1 |
| 6. Notifications | 2 days | Phase 3 | P1 |
| 7. Delegate Discovery | 2 days | Phase 2 | P1 |
| 8. Analytics | 2 days | Phase 3 | P2 |
| 9. Enterprise | 3 days | Phase 5-8 | P2 |
| 10. Launch Polish | 2 days | Phase 1-9 | P0 |
