export type PrivacyTechniqueId = 'coinjoin' | 'payjoin' | 'lightning' | 'atomic-swap' | 'coinswap' | 'cashu'

export interface PrivacyTool {
  name: string
  url: string
  description: string
  platforms: string[]
}

export interface PrivacyStep {
  step: number
  title: string
  description: string
}

export interface PrivacyTechnique {
  id: PrivacyTechniqueId
  name: string
  layer: string
  shortDescription: string
  fullDescription: string
  howItWorks: string
  privacyLevel: 'high' | 'moderate'
  easeOfUse: 'easy' | 'moderate' | 'advanced'
  costEstimate: string
  tools: PrivacyTool[]
  steps: PrivacyStep[]
  caveats: string[]
  regulatoryNote?: string
}

export const OPSEC_PREREQUISITE = {
  title: "Start Here: Operational Security",
  description: "Privacy tools only work if your device and habits are secure. The DNM Bible is a short, practical guide to device security, Tor, PGP, and staying anonymous online.",
  url: "https://darknetbible.info/",
  linkText: "Read the DNM Bible",
}

export const PRIVACY_INTRO = "Every Bitcoin transaction is recorded on a public ledger forever. Surveillance companies sell your financial data to governments and corporations. Your spending, income, and net worth become an open book. Financial privacy is a fundamental right. These techniques help you reclaim it."

export const SAMOURAI_WARNING = {
  title: "Samourai Wallet: Seized by DOJ",
  description: "In April 2024, the DOJ seized Samourai Wallet and arrested its founders. Both were sentenced to federal prison in November 2025. The wallet is no longer operational and is not recommended.",
}

export const PRIVACY_TECHNIQUES: PrivacyTechnique[] = [
  {
    id: 'cashu',
    name: 'Cashu Ecash',
    layer: 'Layer 2',
    shortDescription: 'Digital cash for Bitcoin. Instant, free, and private by default.',
    fullDescription: 'Cashu adds a privacy layer on top of Bitcoin. You deposit sats via Lightning, get blinded ecash tokens back, and spend them freely. The mint cryptographically cannot link your deposit to your spending. No accounts, no sign-ups, no on-chain trace. Your sats stay sats — Cashu is just the privacy layer in between.',
    howItWorks: 'Your wallet blinds a secret before sending it to the mint. The mint signs it without seeing it, and your wallet unblinds the result into a valid token. When you later spend that token, the mint can verify it\'s real but has no way to connect it to when it was created. Tokens move peer-to-peer via copy/paste or QR codes. No blockchain involved.',
    privacyLevel: 'high',
    easeOfUse: 'easy',
    costEstimate: 'Free within same mint, ~2 sats for Lightning on/off-ramp',
    tools: [
      {
        name: 'Cashu.me',
        url: 'https://wallet.cashu.me/',
        description: 'Open it in your browser and start using ecash in seconds. Also works as a mobile PWA.',
        platforms: ['Web', 'PWA'],
      },
      {
        name: 'Macadamia',
        url: 'https://macadamia.cash/',
        description: 'Polished mobile wallet with a focus on simplicity and reliability.',
        platforms: ['iOS', 'Android'],
      },
      {
        name: 'eNuts',
        url: 'https://www.enuts.cash/',
        description: 'Clean mobile wallet with multi-mint support.',
        platforms: ['iOS', 'Android'],
      },
      {
        name: 'Minibits',
        url: 'https://www.minibits.cash/',
        description: 'Fast mobile wallet with Lightning integration.',
        platforms: ['Android'],
      },
      {
        name: 'Nutstash',
        url: 'https://wallet.nutstash.app/',
        description: 'Web wallet with Nostr integration and multi-mint support.',
        platforms: ['Web', 'PWA'],
      },
    ],
    steps: [
      { step: 1, title: 'Open a wallet', description: 'Open Cashu.me in your browser, or install eNuts / Minibits on your phone.' },
      { step: 2, title: 'Pick a mint', description: 'Your wallet comes with default mints. You can add more. Use several to spread risk.' },
      { step: 3, title: 'Deposit sats', description: 'Tap deposit, pay the Lightning invoice from any wallet. Your ecash tokens appear instantly.' },
      { step: 4, title: 'Send to anyone', description: 'Copy a token string or show a QR code. Send it however you want — message, email, in person.' },
      { step: 5, title: 'Cash out', description: 'Melt your tokens back to Lightning anytime. Paste an invoice and your sats are returned.' },
    ],
    caveats: [
      'Custodial: The mint holds your bitcoin.',
      'No proof of solvency yet. Spread funds across multiple mints.',
      'When cashing out to Lightning, the mint sees the destination invoice. P2P token transfers remain fully private.',
    ],
    regulatoryNote: 'Mint operators may face money transmitter regulations depending on jurisdiction. The legal landscape is still evolving.',
  },
  {
    id: 'atomic-swap',
    name: 'Atomic Swaps',
    layer: 'Cross-Layer',
    shortDescription: 'Hop trustlessly between on-chain BTC, Lightning, and XMR.',
    fullDescription: 'Move your bitcoin between layers or into Monero without trusting anyone. Boltz lets you swap between on-chain and Lightning. UnstoppableSwap and Haveno let you swap BTC for XMR when you need Monero\'s built-in privacy for spending. Save in BTC, spend in whatever gives you the most privacy.',
    howItWorks: 'These swaps use smart contracts (HTLCs) that guarantee both sides get paid or nobody does. With Boltz, you send on-chain BTC and receive Lightning sats (or the reverse) — great for getting a fresh UTXO with no history. With BTC→XMR swaps, your bitcoin goes in and untraceable Monero comes out. No middleman ever holds your funds. Monero sacrifices the strong verifiability of Bitcoin for privacy — some would argue, that verifiability matters a lot to serve as a savings technology.',
    privacyLevel: 'high',
    easeOfUse: 'moderate',
    costEstimate: '~0.1-0.5% (Boltz) to ~1-3% (XMR swaps) + mining fees',
    tools: [
      {
        name: 'Boltz',
        url: 'https://boltz.exchange/',
        description: 'Swap between on-chain BTC and Lightning instantly. Non-custodial, no accounts, open source.',
        platforms: ['Web', 'API'],
      },
      {
        name: 'UnstoppableSwap',
        url: 'https://unstoppableswap.net/',
        description: 'Peer-to-peer BTC↔XMR swaps. No KYC, no accounts.',
        platforms: ['Windows', 'macOS', 'Linux'],
      },
      {
        name: 'Haveno',
        url: 'https://haveno.exchange/',
        description: 'Decentralized exchange for BTC/XMR trading with built-in escrow.',
        platforms: ['Windows', 'macOS', 'Linux'],
      },
    ],
    steps: [
      { step: 1, title: 'Pick your tool', description: 'Boltz for BTC↔Lightning (just a website). UnstoppableSwap or Haveno for BTC↔XMR (download required).' },
      { step: 2, title: 'Set up a receiving wallet', description: 'Have a Lightning wallet (Zeus, Phoenix) or Monero wallet (Feather) ready to receive into.' },
      { step: 3, title: 'Start the swap', description: 'Choose direction, enter amount, provide your receive address. The tool handles the rest.' },
      { step: 4, title: 'Send and wait', description: 'Send your BTC. Boltz settles in minutes. XMR swaps take 20-60 min for confirmations.' },
      { step: 5, title: 'Swap back when done', description: 'Reverse the process anytime. Move XMR back to BTC, or use Boltz to go from Lightning to a fresh on-chain UTXO.' },
    ],
    caveats: [
      'XMR swaps take 20-60 minutes and liquidity can be limited for large amounts.',
      'You\'ll need a Monero wallet for XMR swaps — small learning curve.',
      'Some exchanges flag deposits from atomic swap-related addresses.',
      'Monero sacrifices the strong verifiability of Bitcoin for privacy — some would argue, that verifiability matters a lot to serve as a savings technology.',
    ],
    regulatoryNote: 'Monero swaps are legal but increasingly scrutinized. Several exchanges have delisted XMR under regulatory pressure.',
  },
  {
    id: 'lightning',
    name: 'Lightning Network',
    layer: 'Layer 2',
    shortDescription: 'Instant off-chain payments with onion-routed privacy.',
    fullDescription: 'Lightning moves your payments off the public blockchain. Payments hop through encrypted channels where no single node sees the full path from sender to receiver. Thousands of transactions, zero on-chain footprint.',
    howItWorks: 'Your payment is routed through a series of channels using onion encryption — each node only knows who handed it the payment and who to pass it to next. Nobody sees the full picture. Only channel opens and closes touch the blockchain.',
    privacyLevel: 'moderate',
    easeOfUse: 'easy',
    costEstimate: 'Near-zero fees (typically < 1 sat per hop)',
    tools: [
      {
        name: 'Zeus',
        url: 'https://zeusln.com/',
        description: 'Self-custodial mobile wallet with embedded node option.',
        platforms: ['iOS', 'Android'],
      },
      {
        name: 'Phoenix',
        url: 'https://phoenix.acinq.co/',
        description: 'Simple self-custodial wallet. Channels managed automatically.',
        platforms: ['iOS', 'Android'],
      },
      {
        name: 'Start9',
        url: 'https://start9.com/',
        description: 'Run your own Lightning + Bitcoin node for full sovereignty.',
        platforms: ['Start9 Server', 'Raspberry Pi', 'x86'],
      },
    ],
    steps: [
      { step: 1, title: 'Install a wallet', description: 'Download Zeus or Phoenix on your phone. Both handle channels automatically.' },
      { step: 2, title: 'Add some sats', description: 'Send on-chain bitcoin to your wallet. A Lightning channel opens for you.' },
      { step: 3, title: 'Pay instantly', description: 'Scan a Lightning invoice or LNURL. Payment arrives in seconds.' },
      { step: 4, title: 'Get paid', description: 'Share your invoice or Lightning Address. Incoming payments route through the network privately.' },
    ],
    caveats: [
      'Channel opens/closes are visible on-chain.',
      'Custodial Lightning wallets (Wallet of Satoshi, etc.) see everything — use self-custodial.',
      'Large payments may fail if channels lack liquidity.',
    ],
  },
  {
    id: 'coinjoin',
    name: 'CoinJoin',
    layer: 'On-Chain',
    shortDescription: 'Pool your transaction with others so nobody can tell whose coins are whose.',
    fullDescription: 'CoinJoin mixes your bitcoin with other users in a single transaction. Everyone puts coins in, everyone gets the same amount out, and the link between your input and output is broken. Surveillance companies can no longer trace where your coins went.',
    howItWorks: 'Multiple people create one transaction together. All outputs are the same size, so an observer can\'t tell which input paid which output. A coordinator helps arrange the transaction but never holds your funds. You get back the same amount you put in (minus a small fee), but the trail is cut.',
    privacyLevel: 'high',
    easeOfUse: 'moderate',
    costEstimate: '0.3–1% coordinator fee + mining fees',
    tools: [
      {
        name: 'Wasabi Wallet',
        url: 'https://wasabiwallet.io/',
        description: 'Desktop wallet that CoinJoins your funds automatically in the background.',
        platforms: ['Windows', 'macOS', 'Linux'],
      },
      {
        name: 'JoinMarket',
        url: 'https://github.com/JoinMarket-Org/joinmarket-clientserver',
        description: 'Decentralized CoinJoin. Earn fees by providing liquidity as a maker.',
        platforms: ['Linux', 'macOS'],
      },
    ],
    steps: [
      { step: 1, title: 'Install Wasabi or JoinMarket', description: 'Download Wasabi Wallet for the easiest experience. JoinMarket for more control.' },
      { step: 2, title: 'Send bitcoin to the wallet', description: 'Wasabi routes through Tor automatically to protect your IP.' },
      { step: 3, title: 'CoinJoin runs automatically', description: 'Wasabi mixes your coins in the background. JoinMarket lets you initiate joins manually.' },
      { step: 4, title: 'Spend your mixed coins', description: 'Important: never combine mixed coins with unmixed ones, or you undo the privacy.' },
    ],
    caveats: [
      'Never merge mixed and unmixed coins — this destroys your privacy.',
      'Multiple rounds give stronger anonymity.',
      'Some exchanges flag or reject deposits from CoinJoin outputs.',
    ],
    regulatoryNote: 'Legal in most places, but the DOJ considers CoinJoin coordination potential money transmission. Some exchanges will freeze CoinJoined deposits.',
  },
  {
    id: 'coinswap',
    name: 'CoinSwap',
    layer: 'Off-Chain',
    shortDescription: 'Transfer bitcoin ownership off-chain. Nothing visible until you settle.',
    fullDescription: 'CoinSwap lets you transfer ownership of a bitcoin UTXO without any on-chain transaction. Mercury Layer uses statechains — you pass the private key through a blinded server, so the UTXO doesn\'t move on the blockchain at all until the final owner decides to claim it.',
    howItWorks: 'You deposit bitcoin into a shared key with the Mercury server. To transfer it, the server co-signs a new backup transaction for the recipient — but because it\'s blinded, the server never learns who the new owner is. The UTXO sits still on-chain while ownership changes hands invisibly.',
    privacyLevel: 'high',
    easeOfUse: 'advanced',
    costEstimate: 'Mining fees only when settling on-chain',
    tools: [
      {
        name: 'Mercury Layer',
        url: 'https://mercurylayer.com/',
        description: 'Statechain transfers — instant, free, and invisible until you settle.',
        platforms: ['Web', 'CLI'],
      },
    ],
    steps: [
      { step: 1, title: 'Go to Mercury Layer', description: 'Open the web interface or set up the CLI tool.' },
      { step: 2, title: 'Deposit bitcoin', description: 'Create a statechain by depositing into a shared key with the Mercury server.' },
      { step: 3, title: 'Transfer off-chain', description: 'Send the statechain to anyone. The transfer is instant, free, and invisible on-chain.' },
      { step: 4, title: 'Settle when ready', description: 'Broadcast the final transaction to claim the UTXO on-chain whenever you want.' },
    ],
    caveats: [
      'Mercury server must be online for transfers to work.',
      'Fixed UTXO sizes — you can\'t split or merge amounts.',
      'Newer technology with limited tooling.',
    ],
  },
  {
    id: 'payjoin',
    name: 'PayJoin',
    layer: 'On-Chain',
    shortDescription: 'Both sender and receiver add inputs, confusing blockchain analysis.',
    fullDescription: 'In a normal transaction, all inputs are the sender\'s. PayJoin breaks that assumption — the receiver adds an input too. On-chain it looks like a regular payment, but surveillance tools can no longer tell who owns what. It poisons their data models.',
    howItWorks: 'The receiver adds one of their own coins as an input alongside yours and adjusts the outputs. The final transaction looks completely normal on-chain, but the assumption that "all inputs = one owner" is broken. Chainalysis hates this.',
    privacyLevel: 'moderate',
    easeOfUse: 'moderate',
    costEstimate: 'Standard mining fees only',
    tools: [
      {
        name: 'BTCPay Server',
        url: 'https://btcpayserver.org/',
        description: 'Self-hosted payment processor with built-in PayJoin. Great for merchants.',
        platforms: ['Self-hosted', 'Linux', 'Docker'],
      },
      {
        name: 'Cake Wallet',
        url: 'https://cakewallet.com/',
        description: 'Mobile wallet with PayJoin support.',
        platforms: ['iOS', 'Android'],
      },
    ],
    steps: [
      { step: 1, title: 'Get a compatible wallet', description: 'BTCPay Server for merchants, Cake Wallet for individuals.' },
      { step: 2, title: 'Create a PayJoin invoice', description: 'The receiver generates a payment request with a PayJoin endpoint.' },
      { step: 3, title: 'Pay normally', description: 'The sender\'s wallet detects PayJoin support and handles the rest automatically.' },
      { step: 4, title: 'Done — looks like a normal transaction', description: 'No special markers on-chain. Analysts can\'t tell it was a PayJoin.' },
    ],
    caveats: [
      'Both parties need PayJoin-compatible wallets.',
      'Receiver must be online during the payment.',
      'Adoption is still low, so opportunities to use it are limited.',
    ],
  },
]
