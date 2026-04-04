"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, type OriginRect } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Clock, Hash, Zap, Database, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectedBlock {
  blockSize: number
  nTx: number
  feeRange: number[]
  estimatedTime: string
  height: number
  medianFee?: number
  totalFees?: number
}

interface ProjectedBlockDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  projectedBlock: ProjectedBlock | null
  originRect?: OriginRect | null
}

export function ProjectedBlockDetailsModal({ isOpen, onClose, projectedBlock, originRect }: ProjectedBlockDetailsModalProps) {
  if (!isOpen || !projectedBlock) return null

  const getAverageFeeRate = (feeRange: number[]) => {
    if (!feeRange || feeRange.length === 0) return "~1"
    const sortedFees = [...feeRange].sort((a, b) => a - b)
    const median = sortedFees[Math.floor(sortedFees.length / 2)]
    return Math.round(median)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const medianFee = getAverageFeeRate(projectedBlock.feeRange)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-testid="projected-block-modal" className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0" originRect={originRect}>
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b border-[hsl(var(--border-subtle))] bg-[hsl(var(--accent)/0.05)]">
          <DialogTitle className="text-[hsl(var(--accent))] flex items-center gap-2 text-lg sm:text-xl">
            <Hash className="w-5 h-5 sm:w-6 sm:h-6" />
            Projected Block Details
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] border border-[hsl(var(--accent)/0.3)]">Projected</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {/* Hero Section: Height & Time */}
            <motion.div
              data-stagger-item
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[hsl(var(--accent)/0.05)] blur-3xl rounded-full" />
              <div className="relative z-10 text-center mb-6 sm:mb-8">
                <div className="text-xs sm:text-sm text-[hsl(var(--accent)/0.8)] uppercase tracking-widest mb-1">Projected Height</div>
                <div className="text-4xl sm:text-6xl md:text-7xl font-mono font-bold tabular-nums text-white mb-2">
                  {projectedBlock.height.toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent)/0.8)] text-xs sm:text-sm font-mono">
                  <Clock className="w-3 h-3" />
                  Expected in {projectedBlock.estimatedTime}
                </div>
              </div>
            </motion.div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <motion.div data-stagger-item variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                  <div className="flex items-center gap-1 sm:gap-2 text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                    <Database className="w-3 h-3 hidden sm:block" />
                    Size
                  </div>
                  <div className="text-white font-mono tabular-nums text-sm sm:text-xl">{formatBytes(projectedBlock.blockSize)}</div>
                </Card>
              </motion.div>

              <motion.div data-stagger-item variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                  <div className="flex items-center gap-1 sm:gap-2 text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                    <Hash className="w-3 h-3 hidden sm:block" />
                    TXs
                  </div>
                  <div className="text-white font-mono tabular-nums text-sm sm:text-xl">{projectedBlock.nTx.toLocaleString()}</div>
                </Card>
              </motion.div>

              <motion.div data-stagger-item variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                <Card className="bg-[hsl(var(--surface-2))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-4 h-full hover:bg-[hsl(var(--surface-3)/0.5)] transition-colors">
                  <div className="flex items-center gap-1 sm:gap-2 text-[hsl(var(--text-muted))] text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 hidden sm:block" />
                    Fee
                  </div>
                  <div className="text-white font-mono tabular-nums text-sm sm:text-xl">~{medianFee} <span className="text-[10px] sm:text-sm">sat/vB</span></div>
                </Card>
              </motion.div>
            </div>

            {/* Fee Range Visualization */}
            <motion.div
              data-stagger-item
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <Card className="bg-[hsl(var(--surface-1))] border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent)/0.5)] p-3 sm:p-5">
                <h4 className="text-[hsl(var(--accent))] font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Fee Range Projection
                </h4>

                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2.5">
                    {(() => {
                      const minFee = projectedBlock.feeRange[0]
                      const maxFee = projectedBlock.feeRange[projectedBlock.feeRange.length - 1]
                      const items = [
                        { label: "Min", value: minFee },
                        { label: "Median", value: Number(medianFee) },
                        { label: "Max", value: maxFee },
                      ]
                      return items.map((item) => {
                        const pct = maxFee > 0 ? Math.max(4, (item.value / maxFee) * 100) : 0
                        return (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-[hsl(var(--text-muted))]">{item.label}</span>
                              <span className="text-white font-mono tabular-nums">
                                {Number(item.value).toFixed(1)} sat/vB
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

                  <div className="pt-4 border-t border-[hsl(var(--border-subtle))]">
                    <p className="text-xs text-[hsl(var(--text-muted))] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[hsl(var(--accent)/0.5)]" />
                      This block is currently being built in the mempool. The transactions included and their fees are subject to change until a miner successfully finds the block.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
