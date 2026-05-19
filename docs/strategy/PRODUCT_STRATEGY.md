# Product Strategy — iMaVote

> Last updated: 2026-05-19

## Product Thesis

**iMaVote is the open-source, self-hosted governance platform that makes on-chain voting as easy as filling out a Google Form** — while maintaining full cryptographic verifiability, multi-chain support, and enterprise-grade access control.

We exist in the gap between Snapshot (gasless but off-chain) and Tally (on-chain but complex). iMaVote delivers both: on-chain execution with a frictionless UX.

## Positioning

| Dimension | iMaVote | Snapshot | Tally | Aragon |
|---|---|---|---|---|
| Execution | On-chain | Off-chain | On-chain | On-chain |
| UX Complexity | Low | Low | Medium | High |
| Self-hosted | Yes | No | No | Partial |
| Open source | 100% | Yes | Partial | Yes |
| Delegation | Built-in | No | Yes | Plugin |
| Multi-chain | 7 chains | Multi | EVM | Multi |
| Setup time | < 5 min | < 1 min | 30 min | 1 hr+ |
| Target user | DAOs + Enterprises | DAOs | DAOs | DAOs |

## Tagline

**"Governance that executes."**

## Target Audiences (Priority Order)

1. **Small-to-mid DAOs** (10-500 members) — need simple, self-hosted governance without Governor complexity
2. **Associations & nonprofits** — board votes, member elections, budget approvals
3. **Protocol teams** — need branded governance with delegation for their token holders
4. **Enterprise governance** — shareholder votes, compliance-ready audit trails

## Differentiation Strategy

### 1. Self-hosted simplicity
One-click deploy to any EVM chain. No vendor lock-in. Own your governance data.

### 2. On-chain execution + great UX
Snapshot-like simplicity, but votes actually execute on-chain. Toast notifications, mobile-responsive, dark/light themes.

### 3. Built-in delegation
First-class delegation with profiles, weight tracking, and discovery — not an afterthought.

### 4. Multi-chain native
Deploy the same contracts to Sepolia, Arbitrum, Base, or mainnet. Chain-aware UI adapts automatically.

### 5. Enterprise-ready
Role-based access control, emergency pause, CSV export, audit trail, and compliance-friendly architecture.

## Monetization Strategy

### Phase 1 (Current): Open Source Core
- Free forever. MIT licensed. Build community and adoption.

### Phase 2 (6 months): Hosted SaaS
- `imavote.xyz/create` — deploy governance in 2 clicks
- Free tier: 1 space, 100 voters
- Pro: $49/mo — unlimited spaces, custom branding, analytics
- Enterprise: $499/mo — SSO, compliance, SLA, dedicated RPC

### Phase 3 (12 months): Governance Marketplace
- Template library (election types, voting strategies)
- Plugin ecosystem (Gitcoin Passport integration, AI summaries)
- Delegate marketplace

## Growth Strategy

1. **Developer adoption**: GitHub stars, Hardhat plugin, npm package
2. **Content**: "How to set up DAO governance in 5 minutes" tutorials
3. **Integrations**: Snapshot import, Governor compatibility, Gitcoin Passport
4. **Community**: Discord, governance forum, delegate directory
5. **Enterprise sales**: Direct outreach to associations, co-ops, DAOs with >$1M treasury

## Key Metrics

| Metric | Current | 6-month Target | 12-month Target |
|---|---|---|---|
| GitHub stars | 0 | 500 | 2,000 |
| Deployed instances | 0 | 50 | 500 |
| Monthly active voters | 0 | 1,000 | 10,000 |
| Proposals created | 0 | 200 | 5,000 |
| Revenue (MRR) | $0 | $0 | $5,000 |

## Long-term Moat

1. **Open-source network effects** — community contributions compound
2. **Multi-chain first-mover** — deep integrations across L2 ecosystem
3. **Delegation graph** — the delegate reputation network becomes defensible data
4. **Enterprise compliance** — audit trail + RBAC creates switching costs
5. **Plugin ecosystem** — third-party integrations create lock-in
