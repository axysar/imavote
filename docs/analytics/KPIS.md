# Key Performance Indicators

> Last updated: 2026-05-19

## Purpose

Define measurable success criteria for iMaVote across product, engineering, and growth dimensions. These KPIs guide prioritization, inform roadmap decisions, and provide accountability benchmarks for every execution phase.

## Assumptions

- Product is pre-launch; all current values are zero or baseline.
- Targets assume open-source growth model with no paid marketing spend in the first 6 months.
- Participation rate benchmarks drawn from industry research: Snapshot DAOs average 5-17% participation, top-performing DAOs with delegation reach 30-45%.

---

## Product Metrics

| KPI | Definition | How Measured | Current | 6-mo Target | 12-mo Target | Rationale |
|---|---|---|---|---|---|---|
| Deployed instances | Unique VotingCore deployments across all chains | On-chain contract creation events | 0 | 50 | 500 | Core adoption signal |
| Monthly active voters (MAV) | Unique addresses casting ≥1 vote in trailing 30 days | VoteCast event count (deduplicated by address) | 0 | 1,000 | 10,000 | Primary engagement metric |
| Proposals created | Cumulative proposals across all instances | ProposalCreated events | 0 | 200 | 5,000 | Content generation velocity |
| Participation rate | Average % of registered voters who vote per proposal | `totalVotesOnProposal / totalRegisteredVoters × 100` | 0% | 30% | 45% | Quality of engagement |
| Delegation adoption | % of registered voters with an active delegation | `delegationsCount / totalRegisteredVoters × 100` | 0% | 15% | 30% | Delegation feature validation |
| Voter retention (30d) | % of voters who vote on ≥2 proposals within 30 days | Cohort analysis on VoteCast events | 0% | 40% | 60% | Stickiness signal |
| Time-to-first-vote | Median time from wallet connect to first VoteCast tx | Frontend analytics (connect → castVote delta) | N/A | < 3 min | < 2 min | Onboarding friction |

## Engineering Metrics

| KPI | Definition | How Measured | Current | Target | Implication |
|---|---|---|---|---|---|
| CI pass rate | % of CI runs that complete green | GitHub Actions success rate | N/A | > 98% | Code quality gate |
| Build time | Total CI pipeline duration (lint → test → build) | GitHub Actions timing | N/A | < 3 min | Developer productivity |
| Test count | Total automated test cases across contracts + frontend | `grep -r "it(" test/ \| wc -l` | 51 | 80+ | Regression safety |
| Contract branch coverage | % of Solidity branches exercised by tests | `hardhat coverage` report | ~95% | 98% | Audit readiness |
| Lighthouse perf score | Average Lighthouse performance across all public routes | Lighthouse CI in GitHub Actions | Untested | > 90 | User experience |
| First Contentful Paint | Time to first meaningful render | Lighthouse / Web Vitals | ~1.5s (est) | < 1.5s | Perceived speed |
| Total bundle size | First Load JS (shared) | `next build` output | 88.8 KB | < 100 KB | Load performance |
| Zero-day vulnerabilities | Known critical vulns in dependencies | `npm audit` + Slither | 0 | 0 | Security posture |

## Growth Metrics

| KPI | Definition | How Measured | Current | 6-mo Target | 12-mo Target |
|---|---|---|---|---|---|
| GitHub stars | Repository star count | GitHub API | 0 | 500 | 2,000 |
| GitHub forks | Fork count (proxy for developer adoption) | GitHub API | 0 | 50 | 200 |
| npm downloads/week | If published as a package | npm registry | 0 | 100 | 500 |
| Docs page views/mo | Monthly visits to /docs or docs site | Analytics platform | 0 | 1,000 | 5,000 |
| Community members | Discord + Telegram combined | Platform dashboards | 0 | 200 | 1,000 |
| Contributor count | Unique GitHub contributors (excl. bots) | GitHub Insights | 1 | 10 | 30 |

## Revenue Metrics (Post-SaaS Launch)

| KPI | Definition | 12-mo Target | 24-mo Target |
|---|---|---|---|
| MRR | Monthly recurring revenue from Pro + Enterprise tiers | $3,720 | $14,880 |
| Paid conversion rate | % of free-tier users upgrading to paid | 5% | 7% |
| Churn rate (monthly) | % of paid users canceling per month | < 5% | < 3% |
| LTV:CAC ratio | Lifetime value / Customer acquisition cost | > 3:1 | > 5:1 |

---

## Action Items

1. Implement frontend analytics (connect → vote funnel) to measure time-to-first-vote
2. Add Lighthouse CI to GitHub Actions for automated performance tracking
3. Set up on-chain event monitoring for deployment/proposal/vote counts
4. Establish monthly KPI review cadence once product launches

## Future Considerations

- Add Net Promoter Score (NPS) survey for DAO admins
- Track "governance health score" per DAO instance (participation, delegation ratio, proposal velocity)
- Consider on-chain reputation score for delegates based on voting consistency
