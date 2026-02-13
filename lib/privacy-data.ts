export type PrivacyTechniqueId = 'coinjoin' | 'payjoin' | 'lightning' | 'atomic-swap' | 'coinswap' | 'cashu' | 'p2p'

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
  title: "Step Zero: Operational Security",
  description: "None of these tools matter if your device is already a surveillance device. Running Tor on Windows while logged into Gmail is just larping. The DNM Bible is a short, no-nonsense guide to device security, Tor, PGP, and not leaving a digital trail a first-year analyst could follow.",
  url: "https://darknetbible.info/",
  linkText: "Read the DNM Bible",
}

export const PRIVACY_INTRO = "Every Bitcoin transaction is etched into a public ledger. Forever. Chainalysis, Elliptic, and their friends in three-letter agencies have built an entire industry around watching your coins move. They know what you buy, what you earn, and how much you hold. They call it 'compliance.' We call it a business opportunity. Bitcoin gave us money without banks. These tools give us money without spectators."

export const SAMOURAI_WARNING = {
  title: "Samourai Wallet: Seized by DOJ",
  description: "In April 2024, the DOJ arrested the founders of Samourai Wallet and seized their servers. Their crime? Writing privacy software. Both were sentenced to federal prison in November 2025. The wallet is dead. The precedent is alive. Build accordingly.",
}

export const PRIVACY_TECHNIQUES: PrivacyTechnique[] = [
  {
    id: 'cashu',
    name: 'Cashu Ecash',
    layer: 'Layer 2',
    shortDescription: 'Digital cash for Bitcoin. Instant, free, and private by default.',
    fullDescription: 'Cashu brings David Chaum\'s 1982 dream to Bitcoin. You deposit sats via Lightning, get blinded ecash tokens back, and spend them freely. The mint cryptographically cannot link your deposit to your spending. No accounts, no sign-ups, no KYC theater, no on-chain trace. Your sats stay sats. Cashu is just the privacy layer that makes the surveillance industry obsolete.',
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
      { step: 4, title: 'Send to anyone', description: 'Copy a token string or show a QR code. Send it however you want: message, email, in person.' },
      { step: 5, title: 'Cash out', description: 'Melt your tokens back to Lightning anytime. Paste an invoice and your sats are returned.' },
    ],
    caveats: [
      'Custodial: The mint holds your bitcoin.',
      'No proof of solvency yet. Spread funds across multiple mints.',
      'When cashing out to Lightning, the mint sees the destination invoice. P2P token transfers remain fully private.',
    ],
    regulatoryNote: 'Mint operators may face money transmitter regulations depending on which jurisdiction wants to claim authority over math. The legal landscape is "evolving," which is bureaucrat-speak for "we\'re still writing the paperwork."',
  },
  {
    id: 'p2p',
    name: 'No-KYC P2P',
    layer: 'Acquisition',
    shortDescription: 'Buy bitcoin without handing your passport to a corporation.',
    fullDescription: 'All the privacy tools in the world won\'t help if Coinbase already reported your purchase to the IRS. KYC\'d bitcoin is tagged from the moment you buy it. Every sat is linked to your name, your face, your address, your tax ID before it even hits your wallet. P2P exchanges skip the entire pantomime. You buy directly from another human. No identity verification, no intermediary. Just two people and a trade. Start clean or don\'t bother.',
    howItWorks: 'A P2P platform matches buyers and sellers directly. You find an offer, bitcoin locks into escrow, you send payment through your chosen method (cash, bank transfer, gift cards, whatever works), and the seller releases the bitcoin to you. No account verification. No photo of your ID. No selfie holding a piece of paper like a hostage. The platform never touches your funds. It just holds them in escrow until both sides confirm. You walk away with bitcoin that has no connection to your identity.',
    privacyLevel: 'high',
    easeOfUse: 'moderate',
    costEstimate: '3-10% premium over spot (the price of not being in a database)',
    tools: [
      {
        name: 'Bisq',
        url: 'https://bisq.network/',
        description: 'Fully decentralized, open-source, runs over Tor. No servers to seize, no company to subpoena. The gold standard.',
        platforms: ['Windows', 'macOS', 'Linux'],
      },
      {
        name: 'RoboSats',
        url: 'https://learn.robosats.com/',
        description: 'Lightning-native P2P exchange. Fast trades, small amounts, robot avatars instead of accounts. Tor-only by default.',
        platforms: ['Web (Tor)', 'Android'],
      },
      {
        name: 'Peach Bitcoin',
        url: 'https://peachbitcoin.com/',
        description: 'Mobile-first P2P trading. Clean UI, group buys, good European payment method coverage.',
        platforms: ['iOS', 'Android'],
      },
      {
        name: 'HodlHodl',
        url: 'https://hodlhodl.com/',
        description: 'Non-custodial P2P trading with multisig escrow. Global payment methods.',
        platforms: ['Web'],
      },
    ],
    steps: [
      { step: 1, title: 'Set up a wallet first', description: 'Have a self-custodial Bitcoin wallet ready. Sparrow, Electrum, or a hardware wallet. Never use an exchange wallet.' },
      { step: 2, title: 'Pick a platform', description: 'Bisq for maximum decentralization. RoboSats for fast Lightning trades. Peach or HodlHodl for simplicity.' },
      { step: 3, title: 'Find an offer', description: 'Browse sell offers or create a buy offer. Filter by payment method, amount, and premium.' },
      { step: 4, title: 'Complete the trade', description: 'Bitcoin locks into escrow. You send payment via the agreed method. Seller confirms receipt, bitcoin releases to you.' },
      { step: 5, title: 'Mind your payment method', description: 'Cash in person leaves no trail. Bank transfers have your name on them. Pick your payment method with the same care you pick your privacy tools.' },
    ],
    caveats: [
      'You\'ll pay a premium over exchange prices. Think of it as the cost of not being in a government database.',
      'Counterparty risk exists. Use escrow, start with small amounts, check seller reputation.',
      'Liquidity varies by region and payment method. Patience is part of the trade.',
      'Your payment method is its own attack surface. A bank transfer with your name on it defeats the purpose if the seller gets compromised.',
    ],
    regulatoryNote: 'Buying bitcoin peer-to-peer is legal in most jurisdictions. The compliant exchanges would love for you to think otherwise.',
  },
  {
    id: 'atomic-swap',
    name: 'Atomic Swaps',
    layer: 'Cross-Layer',
    shortDescription: 'Hop trustlessly between on-chain BTC, Lightning, and XMR.',
    fullDescription: 'Move your bitcoin between layers or into Monero without trusting anyone. No exchange, no KYC selfie, no asking permission. Boltz lets you swap between on-chain and Lightning. UnstoppableSwap and Haveno let you swap BTC for XMR when you need Monero\'s built-in opacity for spending. Save in BTC, spend in whatever gives you the most freedom.',
    howItWorks: 'These swaps use smart contracts (HTLCs) that guarantee both sides get paid or nobody does. With Boltz, you send on-chain BTC and receive Lightning sats (or the reverse), great for getting a fresh UTXO with no history. With BTC to XMR swaps, your bitcoin goes in and untraceable Monero comes out. No middleman ever holds your funds. Monero sacrifices the strong verifiability of Bitcoin for privacy. Some would argue that verifiability matters a lot to serve as a savings technology.',
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
      'You\'ll need a Monero wallet for XMR swaps. Small learning curve.',
      'Some exchanges flag deposits from atomic swap-related addresses.',
      'Monero sacrifices the strong verifiability of Bitcoin for privacy. Some would argue that verifiability matters a lot to serve as a savings technology.',
    ],
    regulatoryNote: 'Monero swaps are legal. Several exchanges have delisted XMR anyway because regulators leaned on their licenses. The market routed around them. Decentralized exchanges don\'t have licenses to threaten.',
  },
  {
    id: 'lightning',
    name: 'Lightning Network',
    layer: 'Layer 2',
    shortDescription: 'Instant off-chain payments with onion-routed privacy.',
    fullDescription: 'Lightning pulls your payments off the panopticon that is the base chain. Payments hop through encrypted channels where each node only knows its immediate neighbors, never the full route. Thousands of transactions, zero on-chain footprint. Not perfect privacy, but a massive upgrade over broadcasting your financial life to every node on earth.',
    howItWorks: 'Onion-routed like Tor. Each hop peels one layer of encryption. The node only knows who handed it the payment and where to pass it next. The sender, receiver, and amount stay hidden from every intermediary. Only channel opens and closes ever touch the blockchain. Everything in between is invisible.',
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
      'Custodial Lightning wallets (Wallet of Satoshi, etc.) see everything. Use self-custodial.',
      'Large payments may fail if channels lack liquidity.',
    ],
  },
  {
    id: 'coinjoin',
    name: 'CoinJoin',
    layer: 'On-Chain',
    shortDescription: 'Pool your transaction with others so nobody can tell whose coins are whose.',
    fullDescription: 'CoinJoin is collective self-defense. Multiple users create one transaction together. Everyone puts coins in, everyone gets the same denomination out, and the chain of custody shatters. The surveillance firms that sell your financial biography to governments? They lose the plot. Your coins went in. Identical coins came out. Good luck, Chainalysis.',
    howItWorks: 'Multiple people create one transaction together. All outputs are the same denomination, so an observer staring at the blockchain can\'t tell which input funded which output. A coordinator orchestrates the round but never touches your keys or your funds. You get back the same amount you put in (minus a small fee), but the surveillance trail is severed.',
    privacyLevel: 'high',
    easeOfUse: 'moderate',
    costEstimate: '0.3-1% coordinator fee + mining fees',
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
      'Never merge mixed and unmixed coins. This destroys your privacy.',
      'Multiple rounds give stronger anonymity.',
      'Some exchanges flag or reject deposits from CoinJoin outputs.',
    ],
    regulatoryNote: 'Perfectly legal. The DOJ has treated some CoinJoin coordinators as money transmitters anyway. Some exchanges freeze deposits that smell like CoinJoin. The tools keep shipping. The code doesn\'t care about policy memos.',
  },
  {
    id: 'coinswap',
    name: 'CoinSwap',
    layer: 'Off-Chain',
    shortDescription: 'Transfer bitcoin ownership off-chain. Nothing visible until you settle.',
    fullDescription: 'CoinSwap lets you transfer ownership of a bitcoin UTXO without leaving a single trace on-chain. Mercury Layer uses statechains: the private key changes hands through a blinded server, so the UTXO sits perfectly still on the blockchain while ownership changes hands invisibly. The chain sees nothing. Because there\'s nothing to see.',
    howItWorks: 'You deposit bitcoin into a shared key with the Mercury server. To transfer, the server co-signs a new backup transaction for the recipient, but because it\'s blinded, even the server has no idea who the new owner is. The UTXO sits motionless on-chain. No transaction, no trail, no footprint. Ownership just... moves.',
    privacyLevel: 'high',
    easeOfUse: 'advanced',
    costEstimate: 'Mining fees only when settling on-chain',
    tools: [
      {
        name: 'Mercury Layer',
        url: 'https://mercurylayer.com/',
        description: 'Statechain transfers: instant, free, and invisible until you settle.',
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
      'Fixed UTXO sizes. You can\'t split or merge amounts.',
      'Newer technology with limited tooling.',
    ],
  },
  {
    id: 'payjoin',
    name: 'PayJoin',
    layer: 'On-Chain',
    shortDescription: 'Both sender and receiver add inputs, confusing blockchain analysis.',
    fullDescription: 'In a normal Bitcoin transaction, all inputs belong to the sender. Every surveillance firm on earth relies on that assumption. PayJoin breaks it. The receiver adds an input too. On-chain it looks like a perfectly ordinary payment, but the ownership heuristics that Chainalysis built their billion-dollar valuation on? Poisoned.',
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
      { step: 4, title: 'Done. Looks like a normal tx', description: 'No special markers on-chain. Analysts can\'t tell it was a PayJoin.' },
    ],
    caveats: [
      'Both parties need PayJoin-compatible wallets.',
      'Receiver must be online during the payment.',
      'Adoption is still low, so opportunities to use it are limited.',
    ],
  },
]
