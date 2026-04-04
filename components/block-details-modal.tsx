"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, type OriginRect } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Copy, Check, Clock, Hash, Zap, Users } from "lucide-react"
import { motion } from "framer-motion"

interface BlockDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  blockHash: string | null
  originRect?: OriginRect | null
}

interface BlockDetails {
  id: string
  height: number
  version: number
  timestamp: number
  tx_count: number
  size: number
  weight: number
  merkle_root: string
  previousblockhash: string
  mediantime: number
  nonce: number
  bits: number
  difficulty: number
  chainwork: string
  nTx: number
  extras: {
    reward: number
    coinbaseRaw: string
    orphans: any[]
    feeRange: number[]
    totalFees: number
    avgFee: number
    avgFeeRate: number
    utxoSetChange: number
    avgTxSize: number
    totalInputs: number
    totalOutputs: number
    totalOutputAmt: number
    segwitTotalTxs: number
    segwitTotalSize: number
    segwitTotalWeight: number
  }
}

export function BlockDetailsModal({ isOpen, onClose, blockHash, originRect }: BlockDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && blockHash) {
      fetchBlockDetails(blockHash)
    }
  }, [isOpen, blockHash])

  const fetchBlockDetails = async (hash: string) => {
    setLoading(true)
    setError(null)
    setBlockDetails(null)

    try {
      const response = await fetch(`https://mempool.space/api/block/${hash}`)
      if (!response.ok) {
        throw new Error("Failed to fetch block details")
      }
      const data = await response.json()
      setBlockDetails(data)
    } catch (err) {
      setError("Error fetching block details. Please try again.")
      console.error("Error fetching block details:", err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatSats = (sats: number) => {
    return (sats / 100000000).toFixed(8) + " BTC"
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-testid="block-details-modal" className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0" originRect={originRect}>
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b border-[hsl(var(--border-subtle))] bg-[hsl(var(--accent)/0.05)]">
          <DialogTitle className="text-[hsl(var(--accent))] flex items-center gap-2 text-lg sm:text-xl">
            <Hash className="w-5 h-5 sm:w-6 sm:h-6" />
            Block Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--accent))] mb-4" />
              <span className="text-[hsl(var(--text-muted))] animate-pulse">Retrieving block data from mempool...</span>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-center py-8 bg-red-500/10 rounded-lg border border-red-500/25">
              <div className="text-lg font-bold mb-2">Error Loading Block</div>
              {error}
            </div>
          )}

          {blockDetails && (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06
                  }
                }
              }}
            >
              {/* Hero Section: Height & Hash */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[hsl(var(--accent)/0.05)] blur-3xl rounded-full" />
                <div className="relative z-10 text-center mb-6 sm:mb-8">
                  <div className="text-xs sm:text-sm text-[hsl(var(--accent)/0.8)] uppercase tracking-widest mb-1">Block Height</div>
                   <div className="text-4xl sm:text-6xl md:text-7xl font-mono font-bold tabular-nums text-white block-height-display mb-3 sm:mb-4">
                    {blockDetails.height.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 max-w-2xl mx-auto bg-[hsl(var(--surface-2))] p-2 rounded-lg sm:rounded-full border border-[hsl(var(--border-subtle))] backdrop-blur-sm">
                    <span className="font-mono text-[10px] sm:text-xs md:text-sm text-[hsl(var(--text-muted))] truncate min-w-0 flex-1 px-1 sm:px-2">
                      {blockDetails.id}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(blockDetails.id, "hash")}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.2)] rounded-full"
                      >
                        {copiedField === "hash" ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full"
                      >
                        <a
                          href={`https://mempool.space/block/${blockDetails.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                  <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                    <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">Timestamp</div>
                    <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{formatDate(blockDetails.timestamp)}</div>
                  </Card>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                  <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                    <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">Size</div>
                    <div className="text-white font-mono tabular-nums text-sm sm:text-lg">{formatBytes(blockDetails.size)}</div>
                  </Card>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                  <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                    <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">Weight</div>
                    <div className="text-white font-mono tabular-nums text-sm sm:text-lg">{blockDetails.weight.toLocaleString()} WU</div>
                  </Card>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                  <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                    <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">Transactions</div>
                    <div className="text-white font-mono tabular-nums text-sm sm:text-lg">{blockDetails.tx_count.toLocaleString()}</div>
                  </Card>
                </motion.div>
              </div>

              {/* Detailed Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Fee Statistics */}
                {blockDetails.extras && (
                  <motion.div
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Card className="bg-[hsl(var(--surface-1))] border-green-500/20 border-l-2 border-l-green-500/50 overflow-hidden h-full">
                      <div className="bg-green-500/10 p-3 border-b border-green-500/20 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-400" />
                        <h4 className="text-green-400 font-semibold text-sm sm:text-base">Fee Statistics</h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div data-stagger-item className="flex justify-between items-center p-2 rounded bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                          <span className="text-[hsl(var(--text-muted))] text-xs sm:text-sm">Total Fees</span>
                          <span className="text-green-400 font-mono font-bold tabular-nums text-xs sm:text-sm">{formatSats(blockDetails.extras.totalFees)}</span>
                        </div>
                        <div data-stagger-item className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="p-2 rounded bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                            <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs mb-1">Average Fee</div>
                            <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{blockDetails.extras.avgFee.toLocaleString()} sat</div>
                          </div>
                          <div className="p-2 rounded bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                            <div className="text-[hsl(var(--text-muted))] text-[10px] sm:text-xs mb-1">Avg Fee Rate</div>
                            <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{blockDetails.extras.avgFeeRate.toFixed(1)} sat/vB</div>
                          </div>
                        </div>
                        <div data-stagger-item className="space-y-2.5">
                          <div className="text-[hsl(var(--text-muted))] text-xs mb-1">Fee Rates (sat/vB)</div>
                          {(() => {
                            const maxFee = blockDetails.extras.feeRange[blockDetails.extras.feeRange.length - 1]
                            const items = [
                              { label: "Min", value: blockDetails.extras.feeRange[0] },
                              { label: "Avg", value: blockDetails.extras.avgFeeRate },
                              { label: "Max", value: maxFee },
                            ]
                            return items.map((item) => {
                              const pct = maxFee > 0 ? Math.max(4, (item.value / maxFee) * 100) : 0
                              return (
                                <div key={item.label} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-[hsl(var(--text-muted))]">{item.label}</span>
                                    <span className="text-white font-mono tabular-nums">
                                      {Number(item.value).toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-[hsl(var(--surface-3))] overflow-hidden">
                                    <div
                                      className="h-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--accent)/0.3)] to-[hsl(var(--accent))]"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Transaction Details */}
                {blockDetails.extras && (
                  <motion.div
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Card className="bg-[hsl(var(--surface-1))] border-blue-500/20 border-l-2 border-l-blue-500/50 overflow-hidden h-full">
                      <div className="bg-blue-500/10 p-3 border-b border-blue-500/20 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <h4 className="text-blue-400 font-semibold text-sm sm:text-base">Transaction Details</h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div data-stagger-item className="flex justify-between items-center p-2 rounded bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                          <span className="text-[hsl(var(--text-muted))] text-xs sm:text-sm">Block Reward</span>
                          <span className="text-[hsl(var(--accent))] font-mono font-bold tabular-nums text-xs sm:text-sm">{formatSats(blockDetails.extras.reward)}</span>
                        </div>
                        <div data-stagger-item className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          <div className="p-1.5 sm:p-2 bg-[hsl(var(--surface-2))] rounded border border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                            <div className="text-[hsl(var(--text-muted))] text-[9px] sm:text-[10px] uppercase">Avg Size</div>
                            <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{blockDetails.extras.avgTxSize.toFixed(0)} B</div>
                          </div>
                          <div className="p-1.5 sm:p-2 bg-[hsl(var(--surface-2))] rounded border border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                            <div className="text-[hsl(var(--text-muted))] text-[9px] sm:text-[10px] uppercase">Inputs</div>
                            <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{blockDetails.extras.totalInputs.toLocaleString()}</div>
                          </div>
                          <div className="p-1.5 sm:p-2 bg-[hsl(var(--surface-2))] rounded border border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                            <div className="text-[hsl(var(--text-muted))] text-[9px] sm:text-[10px] uppercase">Outputs</div>
                            <div className="text-white font-mono tabular-nums text-xs sm:text-sm">{blockDetails.extras.totalOutputs.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* SegWit Mini-Section */}
                        {blockDetails.extras.segwitTotalTxs > 0 && (
                          <div data-stagger-item className="pt-2 border-t border-[hsl(var(--border-subtle))]">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-purple-400 text-xs font-semibold">SegWit Adoption</span>
                              <span className="text-purple-300 text-xs font-mono tabular-nums">
                                {Math.round((blockDetails.extras.segwitTotalTxs / blockDetails.tx_count) * 100)}%
                              </span>
                            </div>
                            <div className="text-xs text-[hsl(var(--text-muted))]">
                              <span className="font-mono tabular-nums">{blockDetails.extras.segwitTotalTxs.toLocaleString()}</span> SegWit transactions
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Technical Details */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Card className="bg-[hsl(var(--surface-1))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4">
                  <h4 className="text-[hsl(var(--text-muted))] font-semibold mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    Technical Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[10px] sm:text-xs font-mono">
                    <div data-stagger-item className="flex flex-col">
                      <span className="text-[hsl(var(--text-muted))] mb-1">Merkle Root</span>
                      <span className="text-gray-300 break-all bg-[hsl(var(--surface-2))] p-1.5 rounded border border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                        {blockDetails.merkle_root}
                      </span>
                    </div>
                    <div data-stagger-item className="flex flex-col">
                      <span className="text-[hsl(var(--text-muted))] mb-1">Previous Block</span>
                      <span className="text-gray-300 break-all bg-[hsl(var(--surface-2))] p-1.5 rounded border border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                        {blockDetails.previousblockhash}
                      </span>
                    </div>
                    <div data-stagger-item className="flex justify-between py-1.5 px-1 rounded border-b border-[hsl(var(--border-subtle))] mt-2 hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                      <span className="text-[hsl(var(--text-muted))]">Bits</span>
                      <span className="text-gray-300 tabular-nums">{blockDetails.bits.toString(16)}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between py-1.5 px-1 rounded border-b border-[hsl(var(--border-subtle))] mt-2 hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                      <span className="text-[hsl(var(--text-muted))]">Nonce</span>
                      <span className="text-gray-300 tabular-nums">{blockDetails.nonce.toLocaleString()}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between py-1.5 px-1 rounded border-b border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                      <span className="text-[hsl(var(--text-muted))]">Version</span>
                      <span className="text-gray-300 tabular-nums">{blockDetails.version}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between py-1.5 px-1 rounded border-b border-[hsl(var(--border-subtle))] hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                      <span className="text-[hsl(var(--text-muted))]">Difficulty</span>
                      <span className="text-gray-300 tabular-nums">{blockDetails.difficulty.toExponential(2)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
