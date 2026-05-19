# Pricing Strategy — iMaVote

> Last updated: 2026-05-19

## Pricing Philosophy

Open-source core, monetize convenience. The contracts and frontend are MIT-licensed forever. Revenue comes from hosted infrastructure, enterprise features, and time-saving tooling — not from locking down the protocol.

## Tier Structure

| Tier | Price | Target | Includes |
|---|---|---|---|
| **Open Source** | Free forever | Developers, small DAOs | Full source code, self-deploy, community support |
| **Starter** | Free hosted | First-time DAOs, side projects | 1 governance space, 50 voters, 10 proposals/mo, iMaVote subdomain |
| **Pro** | $49/mo | Growing DAOs, associations | Unlimited spaces, unlimited voters, custom domain, analytics dashboard, email notifications, CSV/PDF export, priority support |
| **Enterprise** | $499/mo | Large DAOs, corporations, governments | Everything in Pro + SSO/SAML, compliance audit trail, branded UI, SLA, dedicated RPC endpoints, custom voting strategies, API access, onboarding assistance |
| **Custom** | Contact us | Governments, large enterprises | On-premise deployment, formal audit support, custom contract modifications, training |

## Revenue Model Assumptions

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Free tier users | 500 | 2,000 | 5,000 |
| Pro conversions (5%) | 25 | 100 | 250 |
| Enterprise (1%) | 5 | 20 | 50 |
| Pro MRR | $1,225 | $4,900 | $12,250 |
| Enterprise MRR | $2,495 | $9,980 | $24,950 |
| **Total MRR** | **$3,720** | **$14,880** | **$37,200** |
| **Total ARR** | **$44,640** | **$178,560** | **$446,400** |

## Pricing Rationale

### Why free tier?
- DAO governance is a public good. Open-source builds trust.
- Free users become advocates and contributors.
- Reduces CAC through organic growth and word-of-mouth.

### Why $49/mo for Pro?
- Comparable to Snapshot's implied value (free but vendor-locked).
- Below Aragon's enterprise pricing ($199+/mo).
- Sweet spot for DAOs with 100-1000 members managing real treasuries.
- Value prop: "Skip 20 hours of DevOps setup for $49/mo."

### Why $499/mo for Enterprise?
- Compliance, audit trails, and SLAs justify premium pricing.
- Corporate governance software (Diligent, Broadridge) charges $10K+/yr.
- 10x cheaper than incumbent enterprise solutions.
- High LTV — enterprises churn slowly once integrated.

## Competitive Pricing Comparison

| Platform | Free Tier | Paid Tier | Enterprise |
|---|---|---|---|
| Snapshot | Free (off-chain) | N/A | N/A |
| Tally | Free (on-chain) | Premium (undisclosed) | Enterprise (custom) |
| Aragon | Free (self-host) | $199+/mo | Custom |
| Vocdoni | Free trial | SaaS pricing | Custom |
| **iMaVote** | **Free (full OSS)** | **$49/mo** | **$499/mo** |

## Monetization Levers

1. **Hosted infrastructure** — RPC endpoints, subgraph hosting, IPFS pinning
2. **Convenience features** — analytics, notifications, branded domains
3. **Compliance** — audit trail PDF, role hierarchy, SSO
4. **Support** — SLA, onboarding, dedicated account manager
5. **Future: marketplace** — premium voting strategy plugins, identity integrations

## Key Decisions

- **Never paywall the contracts** — open-source trust is the foundation
- **Never paywall basic voting** — gasless voting should be free at protocol level
- **Monetize the ops layer** — hosting, monitoring, notifications, analytics
- **Land with free, expand with Pro** — classic PLG motion
