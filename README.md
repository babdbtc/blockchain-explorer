# babd.space

**<https://babd.space>**

A Bitcoin block explorer with a 3D space theme.

## Features

- Real-time Bitcoin stats via WebSocket (price, fees, mempool, block height)
- Block timeline with weight visualization
- Transaction and address search
- Cashu ecash donations
- Lightning Address (`babd@babd.space`)
- NIP-05 Nostr verification

## Tech

- Next.js 15 (App Router), React 19
- Three.js for the 3D scene
- Tailwind CSS, shadcn/ui, Framer Motion
- TanStack Query + Mempool.space WebSocket API
- `@cashu/cashu-ts` for ecash

## Run locally

```bash
git clone https://github.com/babdbtc/babd.git
cd babd
npm install
npm run dev
```

Open `http://localhost:3000`
