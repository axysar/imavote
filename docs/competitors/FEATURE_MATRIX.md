# Feature Comparison Matrix

> Last updated: 2026-05-19

## Core Features

| Feature | iMaVote | Snapshot | Tally | Aragon | Vocdoni |
|---|---|---|---|---|---|
| On-chain execution | Yes | No | Yes | Yes | Hybrid |
| Gasless voting | No (planned) | Yes | Yes (new) | Plugin | Yes |
| Yes/No/Abstain | Yes | Yes | Yes | Yes | Yes |
| Quadratic voting | Planned | Yes | No | Plugin | No |
| Ranked choice | Planned | Yes | No | No | No |
| Weighted voting | Planned | Yes | Yes | Plugin | No |
| Voting deadlines | Yes | Yes | Yes | Yes | Yes |
| Proposal lifecycle | Pending→Active→Closed | Open→Closed | Governor | Configurable | Configurable |

## Delegation

| Feature | iMaVote | Snapshot | Tally | Aragon | Vocdoni |
|---|---|---|---|---|---|
| Vote delegation | Yes | No | Yes | Plugin | No |
| Delegate profiles | Yes (on-chain URI) | No | Yes | No | No |
| Partial delegation | No | No | Yes | No | No |
| Delegate discovery | Planned | No | Yes | No | No |
| Weight tracking | Yes | N/A | Yes | Plugin | No |

## Infrastructure

| Feature | iMaVote | Snapshot | Tally | Aragon | Vocdoni |
|---|---|---|---|---|---|
| Self-hosted | Yes | No | No | Partial | Yes |
| Open source | 100% MIT | Yes | Partial | Yes | Yes |
| Multi-chain | 7 chains | Multi | EVM | Multi | Custom |
| Subgraph | Planned | IPFS | Yes | Yes | Custom |
| API | Planned | Yes | Yes | Yes | Yes |

## UX & Design

| Feature | iMaVote | Snapshot | Tally | Aragon | Vocdoni |
|---|---|---|---|---|---|
| Dark/light theme | Yes | No (dark only) | Yes | Yes | No |
| Mobile responsive | Yes | Yes | Yes | Partial | Yes |
| Activity feed | Yes | No | Yes | No | No |
| CSV export | Yes | No | No | No | Yes |
| Search & filter | Yes | Yes | Yes | Yes | Basic |
| Toast notifications | Yes | No | No | No | No |

## Security

| Feature | iMaVote | Snapshot | Tally | Aragon | Vocdoni |
|---|---|---|---|---|---|
| RBAC | AccessControl | Space admin | Governor | Permission manager | Admin |
| Emergency pause | Yes | No | Timelock | Yes | No |
| Double-vote prevention | On-chain | Off-chain | On-chain | On-chain | Cryptographic |
| Reentrancy guard | Yes | N/A | Yes | Yes | N/A |
| Sybil resistance | Planned | Passport plugin | No | No | Identity check |

## Key Differentiators for iMaVote

1. **Only platform** that is 100% open-source, self-hosted, AND has on-chain execution
2. **Only platform** with built-in delegation + emergency pause + RBAC in a single contract
3. **Only platform** targeting both DAO and enterprise governance from day one
4. **Fastest setup** for on-chain governance — no Governor framework required
