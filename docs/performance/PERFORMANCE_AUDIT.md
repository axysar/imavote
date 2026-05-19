# Performance Audit — iMaVote

> Last updated: 2026-05-19

## Bundle Analysis

| Route | Size | First Load JS | Status |
|---|---|---|---|
| `/` | 7.67 kB | 177 kB | OK |
| `/dashboard` | 9.22 kB | 181 kB | OK |
| `/proposals/[id]` | 8.89 kB | 180 kB | OK |
| `/admin` | 7.82 kB | 171 kB | OK |
| `/delegate` | 4.42 kB | 167 kB | OK |
| `/activity` | 40.3 kB | 187 kB | Review — viem event parsing is heavy |
| Middleware | 26.9 kB | — | OK |
| Shared chunks | 88.8 kB | — | OK |

## Performance Targets

| Metric | Current (est.) | Target | Status |
|---|---|---|---|
| First Contentful Paint | ~1.5s | < 1.5s | Borderline |
| Largest Contentful Paint | ~2.5s | < 2.5s | Borderline |
| Time to Interactive | ~3.0s | < 3.0s | Borderline |
| Cumulative Layout Shift | ~0.05 | < 0.1 | OK |
| Lighthouse Performance | Untested | > 90 | Pending |

## Optimization Opportunities

### High Impact
1. **Dynamic imports for heavy pages** — `/activity` loads viem event parsing code (40 kB). Lazy-load with `next/dynamic`.
2. **React Query staleTime tuning** — currently 10s; proposals don't change that fast. Increase to 30s for read-heavy pages.
3. **Preconnect to RPC endpoints** — add `<link rel="preconnect">` for Alchemy/Infura domains.

### Medium Impact
4. **Image optimization** — no images currently, but OG images and app icons should use next/image when added.
5. **Font subsetting** — Inter loaded from system stack (no network font request). Already optimal.
6. **Code splitting** — Framer Motion (11 kB gzipped) only used on landing page. Could lazy-load.

### Low Impact
7. **Service Worker** — PWA manifest exists but no SW for offline caching.
8. **Edge caching** — Vercel/Cloudflare can cache static routes at the edge.

## Smart Contract Gas Costs

| Function | Gas (approx) | USD @ 30 gwei, $3000 ETH |
|---|---|---|
| castVote | ~65,000 | $5.85 |
| createProposal | ~120,000 | $10.80 |
| registerVoter | ~48,000 | $4.32 |
| activateProposal | ~30,000 | $2.70 |
| setDelegate | ~50,000 | $4.50 |

On L2 (Arbitrum/Base): all functions cost < $0.05.

## Recommendations

1. **Primary deployment target should be an L2** (Base or Arbitrum) — 100x cheaper gas
2. Add `next/dynamic` for `/activity` page
3. Add Lighthouse CI to the GitHub Actions pipeline
4. Add `preconnect` hints for RPC domains in layout.tsx
