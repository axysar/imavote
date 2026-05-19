# Test Strategy — iMaVote

> Last updated: 2026-05-19

## Current Coverage

| Layer | Framework | Test Files | Cases | Coverage |
|---|---|---|---|---|
| Smart contracts | Hardhat + Chai | 4 | 51 | ~95% branches |
| Frontend hooks | — | 0 | 0 | 0% |
| UI components | — | 0 | 0 | 0% |
| E2E flows | — | 0 | 0 | 0% |

## Test Pyramid

```
        /  E2E  \          ← Playwright (future)
       /  Integ  \         ← Hook tests with mock providers
      /   Unit    \        ← Contract tests (43 cases)
     / Static Anal \       ← TypeScript strict, ESLint, Slither
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
```

## Contract Test Coverage (51 cases)

### VotingCore (31 tests)
- Voter registration: register, duplicate prevention, zero-address, unauthorized, batch, deregister
- Proposal lifecycle: create, empty title, past deadline, state transitions, invalid state, invalid ID
- Vote casting: Yes/No/Abstain, events, double voting, unregistered, invalid selection, inactive proposal, deadline enforcement, hasVoted tracking
- Views: participation rate, pagination
- Emergency: pause/unpause, unauthorized pause

### VoteDelegation (10 tests)
- Delegation: set, zero-address, self-delegation, duplicate, switch, accumulate weight, remove, non-existent removal
- Profiles: set/read, unset default

### VoterRegistry (8 tests)
- CRUD: add, duplicate, zero-address, unauthorized, remove, non-registered, enumerate, out-of-bounds

### VotingStrategies (8 tests)
- equalWeight: returns 1 for any address
- fixedWeight: returns provided value
- quadraticWeight: sqrt of perfect squares, floors non-perfect squares
- cappedWeight: below cap, above cap, equal, zero edge cases

## Targets

| Metric | Current | Target |
|---|---|---|
| Contract branch coverage | ~95% | 98% |
| Contract test cases | 51 | 60+ |
| Frontend hook tests | 0 | 20+ |
| Component tests | 0 | 10+ |
| E2E critical paths | 0 | 5+ |
| CI pipeline | None | Every PR |

## Next Steps

1. Add Hardhat coverage report to CI (`hardhat coverage`)
2. Add Vitest for frontend unit tests (hooks with mock wagmi provider)
3. Add Playwright for E2E (connect wallet → vote → verify)
4. Add Slither to CI for static analysis
5. Add gas snapshot regression tests
