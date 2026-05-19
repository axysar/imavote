# Deployment Guide — iMaVote

> Last updated: 2026-05-19

## Quick Start (Local Development)

```bash
git clone https://github.com/axysar/imavote.git
cd imavote
npm install
cp .env.example .env.local

# Terminal 1: Local blockchain
npm run node:local

# Terminal 2: Deploy contracts + seed data
npm run deploy:local

# Terminal 3: Frontend
npm run dev
```

## Contract Deployment

### Supported Networks

| Network | Command | Chain ID | Explorer |
|---|---|---|---|
| Hardhat Local | `npm run deploy:local` | 31337 | — |
| Sepolia | `npm run deploy:sepolia` | 11155111 | etherscan.io |
| Arbitrum Sepolia | `npm run deploy:arb-sepolia` | 421614 | sepolia.arbiscan.io |
| Base Sepolia | `npm run deploy:base-sepolia` | 84532 | sepolia.basescan.org |
| Arbitrum One | `npm run deploy:arbitrum` | 42161 | arbiscan.io |
| Base | `npm run deploy:base` | 8453 | basescan.org |

### Prerequisites

1. Set `PRIVATE_KEY` in `.env.local` (deployer wallet with native gas token)
2. Set `NEXT_PUBLIC_ALCHEMY_KEY` for reliable RPC
3. Set explorer API keys (`ETHERSCAN_API_KEY`, `ARBISCAN_API_KEY`, `BASESCAN_API_KEY`)

### Post-Deploy Checklist

- [ ] Copy VotingCore address from console output
- [ ] Copy VoteDelegation address from console output
- [ ] Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
- [ ] Update `NEXT_PUBLIC_DELEGATION_ADDRESS` in `.env.local`
- [ ] Update `NEXT_PUBLIC_CHAIN_ID` to match deployed network
- [ ] Verify contracts on block explorer (auto-attempted by deploy script)
- [ ] Test proposal creation from admin panel
- [ ] Register initial voters

## Frontend Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

### Self-Hosted

```bash
npm run build
npm run start    # Starts on port 3000
```

For production, use a reverse proxy (nginx/Caddy) with HTTPS.

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | Deployed VotingCore address |
| `NEXT_PUBLIC_DELEGATION_ADDRESS` | Yes | Deployed VoteDelegation address |
| `NEXT_PUBLIC_CHAIN_ID` | Yes | Target chain ID |
| `NEXT_PUBLIC_ALCHEMY_KEY` | Recommended | Alchemy API key for reliable RPC |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Optional | WalletConnect project ID |
| `PRIVATE_KEY` | Deploy only | Deployer wallet private key |
| `ETHERSCAN_API_KEY` | Deploy only | For contract verification |
| `ARBISCAN_API_KEY` | Deploy only | For Arbitrum verification |
| `BASESCAN_API_KEY` | Deploy only | For Base verification |

## Production Recommendations

1. **Use a multisig** (Safe) as the admin role — never a single EOA
2. **Deploy to an L2** (Arbitrum or Base) for 100x cheaper gas
3. **Use a dedicated RPC** (Alchemy, Infura) — public RPCs rate-limit aggressively
4. **Enable CSP headers** — already configured in `middleware.ts`
5. **Monitor contract events** — set up alerts for Pause, role changes
