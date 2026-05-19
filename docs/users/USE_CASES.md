# Use Cases

> Last updated: 2026-05-19

## Purpose

Map the primary workflows iMaVote serves, connecting user personas to concrete product flows. Each use case defines actors, preconditions, the happy-path flow, alternative paths, and how iMaVote delivers value compared to alternatives.

## Assumptions

- All use cases assume wallet-based authentication (no email/password).
- On-chain execution means every vote is permanent and auditable.
- Gas costs vary by chain: ~$5 on mainnet, < $0.05 on Arbitrum/Base.

---

## UC-1: DAO Treasury Proposal

| Field | Detail |
|---|---|
| **Actor** | DAO core contributor (Persona: Alex) |
| **Precondition** | Actor has DEFAULT_ADMIN_ROLE; voters are registered |
| **Trigger** | Community agrees a budget decision needs formal vote |

**Flow**:
1. Admin navigates to `/admin` → Create Proposal
2. Fills title ("Allocate 100 ETH to grants"), description, sets 7-day deadline
3. Submits → signs transaction → proposal created in Pending state
4. Admin clicks Activate → proposal moves to Active
5. Registered voters visit `/proposals/[id]` → cast Yes/No/Abstain
6. After deadline, admin closes proposal → results finalized on-chain
7. Admin exports CSV from dashboard for treasury records

**Alternative paths**:
- Voter discovers proposal via Activity feed notification
- Voter delegates to a trusted delegate instead of voting directly
- Admin pauses voting if governance attack detected

**Value**: Transparent, immutable, auditable budget decisions. No trusted teller required.

---

## UC-2: Protocol Parameter Change

| Field | Detail |
|---|---|
| **Actor** | Protocol team (Persona: Sam) |
| **Precondition** | Protocol governance token holders are registered as voters |
| **Trigger** | Team proposes changing a fee parameter |

**Flow**:
1. Admin creates proposal with technical description and rationale
2. Activates with no deadline (open-ended vote)
3. Token holders vote; weighted voting strategy (future) gives proportional power
4. Admin monitors participation rate on proposal detail sidebar
5. Once quorum is reached, admin closes and reads final tally

**Value**: Decentralized parameter changes without multisig bottleneck.

---

## UC-3: Board Election (Enterprise)

| Field | Detail |
|---|---|
| **Actor** | Nonprofit executive director (Persona: Morgan) |
| **Precondition** | Board member wallets registered via admin panel |
| **Trigger** | Annual board chair election |

**Flow**:
1. Admin batch-registers board member wallets
2. Creates proposal "Board Chair 2026 — Vote to approve Jane Doe"
3. Sets 14-day deadline for compliance
4. Members receive notification (future: email), visit `/proposals/[id]`
5. Members vote Yes/No/Abstain from phone or desktop
6. Admin closes, exports CSV for legal records
7. Results are permanently verifiable on-chain

**Value**: Legally compliant, tamper-proof election at a fraction of the cost of Broadridge/Diligent.

---

## UC-4: Community Temperature Check

| Field | Detail |
|---|---|
| **Actor** | DAO facilitator (Persona: Alex) |
| **Precondition** | Community members registered |
| **Trigger** | Need to gauge sentiment before a major decision |

**Flow**:
1. Admin creates low-stakes proposal ("Should we rebrand?")
2. Activates immediately, no deadline
3. Members vote casually over a few days
4. Facilitator checks participation rate and vote distribution
5. Results inform next steps (binding vote or more discussion)

**Value**: Lightweight consensus-building without gas burden (especially on L2).

---

## UC-5: Delegate Accountability

| Field | Detail |
|---|---|
| **Actor** | Protocol delegate (Persona: Casey) |
| **Precondition** | Delegate has set profile URI on VoteDelegation contract |
| **Trigger** | Delegate wants to attract delegators |

**Flow**:
1. Delegate visits `/delegate`, sets profile URI (IPFS link to statement)
2. Token holders browse delegate directory (future: `/delegates`)
3. Holder delegates voting power via setDelegate transaction
4. Delegate votes on proposals; delegators can verify voting history
5. If delegator disagrees, they revoke delegation with one transaction

**Value**: Accountable representation with on-chain track record. Solves voter apathy by enabling informed delegation.

---

## UC-6: Multi-chain Governance

| Field | Detail |
|---|---|
| **Actor** | Protocol deployed on Arbitrum + Base |
| **Precondition** | VotingCore deployed on both chains |
| **Trigger** | Protocol needs unified governance across L2 deployments |

**Flow**:
1. Deploy VotingCore + VoteDelegation on Arbitrum and Base
2. Configure frontend with chain-specific contract addresses
3. Voters on each chain participate via chain-aware UI
4. NetworkBadge shows which chain the user is connected to
5. Results are independently verifiable on each chain's explorer

**Value**: Unified governance experience across L2 ecosystem.

---

## UC-7: Emergency Governance Halt

| Field | Detail |
|---|---|
| **Actor** | DAO multisig signer (Persona: Sam) |
| **Precondition** | Admin holds DEFAULT_ADMIN_ROLE |
| **Trigger** | Governance attack or exploit detected |

**Flow**:
1. Admin detects suspicious voting pattern (flash loan governance attack)
2. Navigates to `/admin` → Emergency Controls → Pause All Voting
3. Contract enters paused state; all castVote calls revert
4. Team investigates, patches vulnerability
5. Admin resumes voting via Unpause button
6. All existing votes and proposals remain intact

**Value**: Circuit breaker prevents governance attacks during active incidents.

---

## Implications for Product Development

| Use Case | Missing Feature | Priority | Phase |
|---|---|---|---|
| UC-2 | Weighted/token-based voting | High | 5 |
| UC-3 | Email notifications for non-crypto users | High | 6 |
| UC-5 | Delegate directory page | Medium | 7 |
| UC-4 | Gasless voting (meta-transactions) | Medium | Future |
| UC-6 | Cross-chain result aggregation | Low | Future |

## References

- User Personas: `docs/users/USER_PERSONAS.md`
- Journey Maps: `docs/users/JOURNEY_MAPS.md`
- Execution Plan: `docs/execution/EXECUTION_MASTER_PLAN.md`
