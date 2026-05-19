# User Journey Maps

## Journey 1: First-time Voter

```
Discover → Connect Wallet → Browse Proposals → Read Proposal → Vote → Confirm → Share
   │            │                │                  │           │        │        │
   ▼            ▼                ▼                  ▼           ▼        ▼        ▼
 Landing    ConnectWallet     Dashboard         /proposal/1   Radio   Toast    (future)
 page       component        search+filter      detail page   select  success
```

**Pain points**: Gas cost surprise, "what chain am I on?", "am I registered?"
**Opportunities**: Gasless voting (future), clear chain indicator (done), registration check (done)

## Journey 2: DAO Admin Creating a Proposal

```
Connect Wallet → Admin Panel → Fill Form → Set Deadline → Submit → Activate → Monitor
     │               │            │            │             │          │          │
     ▼               ▼            ▼            ▼             ▼          ▼          ▼
  Wallet         Role check    Title +      datetime-     On-chain   Lifecycle  Dashboard
  connect        (RBAC gate)   description  local input   tx sign    card       stats
```

**Pain points**: No proposal templates, no draft saving, no preview
**Opportunities**: Template library (Phase 9), draft persistence, rich text editor

## Journey 3: Delegate Setup

```
Connect → Navigate to /delegate → Enter Address → Sign Tx → Confirm → Share Profile
   │            │                      │              │          │          │
   ▼            ▼                      ▼              ▼          ▼          ▼
 Wallet     Delegation page      Address input    Metamask    Toast     (future)
 connect    status cards         + validation     popup       success   profile page
```

**Pain points**: No delegate discovery, can't browse delegates before choosing
**Opportunities**: Delegate directory (Phase 7), profile pages, voting history

## Journey 4: Enterprise Board Election

```
Setup → Register Voters → Create Proposal → Activate → Collect Votes → Close → Export
  │          │                  │               │            │            │        │
  ▼          ▼                  ▼               ▼            ▼            ▼        ▼
Deploy    Batch register    Proposal form    Lifecycle    Voters vote   Admin    CSV
contract  (admin panel)     + deadline       card         on detail     closes   download
```

**Pain points**: No branded UI, no PDF export, no compliance audit trail
**Opportunities**: White-label (Phase 9), PDF export (Phase 9), timestamped audit log
