"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { ChartModal } from "@/components/chart-modal"
import { FeesModal, MempoolModal } from "@/components/stats-modals"
import { BlockDetailsModal } from "@/components/block-details-modal"
import { useBitcoinStats, useRecentBlocks } from "@/hooks/use-bitcoin-data"

interface StatsPanelProps {
  blockHeight: number
}

type ModalType = 'chart' | 'fees' | 'mempool' | 'unconfirmed' | 'block-height' | null

export function StatsPanel({ blockHeight }: StatsPanelProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isNewBlock, setIsNewBlock] = useState(false)
  const prevBlockHeightRef = useRef(blockHeight)
  const { data: stats, isLoading, error } = useBitcoinStats()
  const { data: recentBlocks } = useRecentBlocks()

  // Get the current block hash from recent blocks (first block is the current one)
  const currentBlockHash = recentBlocks?.[0]?.id ?? null

  // Detect new block and trigger celebration animation
  useEffect(() => {
    if (prevBlockHeightRef.current !== 0 && blockHeight > prevBlockHeightRef.current) {
      setIsNewBlock(true)
      const timer = setTimeout(() => setIsNewBlock(false), 500)
      return () => clearTimeout(timer)
    }
    prevBlockHeightRef.current = blockHeight
  }, [blockHeight])

  // Default values while loading
  const displayStats = stats || {
    price: 0,
    mempoolSize: 0,
    highPriority: 0,
    unconfirmed: 0,
  }

  if (error) {
    console.error("Error fetching stats:", error)
  }

  const handleBlockHeightClick = () => {
    if (currentBlockHash) {
      setActiveModal('block-height')
    }
  }

  return (
    <>
      {/* Block Height - Center Top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 hidden md:block">
        <div className={isNewBlock ? 'new-block-celebration' : ''}>
          <Card
            className="premium-card cursor-pointer hover:scale-[1.02] transition-all duration-150"
            onClick={handleBlockHeightClick}
          >
            <div className="p-4 text-center">
              <div className="text-5xl md:text-6xl font-mono font-bold block-height-display">
                <AnimatedNumber
                  value={blockHeight}
                  formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                  duration={800}
                />
              </div>
              <div className="text-[hsl(var(--accent))] text-sm mt-1 tracking-widest uppercase">Block Height</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Price - Top Left */}
      <div className="absolute top-4 left-4 z-10 cursor-pointer" onClick={() => setActiveModal('chart')}>
        <Card className="premium-card">
          <div className="p-3">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2 shimmer-skeleton" />
                <Skeleton className="h-4 w-24 shimmer-skeleton" />
              </>
            ) : (
              <>
                <div className="text-2xl font-mono font-bold text-[hsl(var(--accent))]">
                  $<AnimatedNumber
                    value={displayStats.price}
                    formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                    duration={800}
                  />
                </div>
                <div className="text-[hsl(var(--accent))] text-sm flex items-center gap-2">Price</div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* High Priority - Top Right */}
      <div className="absolute top-4 right-4 z-10 cursor-pointer" onClick={() => setActiveModal('fees')}>
        <Card className="premium-card">
          <div className="p-3 text-right">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2 ml-auto shimmer-skeleton" />
                <Skeleton className="h-4 w-24 ml-auto shimmer-skeleton" />
              </>
            ) : (
              <>
                <div className="text-2xl font-mono font-bold text-[hsl(var(--accent))]">
                  <AnimatedNumber
                    value={displayStats.highPriority}
                    formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                    duration={800}
                  /> sat/vB
                </div>
                <div className="text-[hsl(var(--accent))] text-sm">High Priority</div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Mempool Size - Bottom Left */}
      <div className="absolute bottom-20 md:bottom-4 left-4 z-10 cursor-pointer" onClick={() => setActiveModal('mempool')}>
        <Card className="premium-card">
          <div className="p-3">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2 shimmer-skeleton" />
                <Skeleton className="h-4 w-28 shimmer-skeleton" />
              </>
            ) : (
              <>
                <div className="text-2xl font-mono font-bold text-[hsl(var(--accent))]">
                  <AnimatedNumber
                    value={displayStats.mempoolSize}
                    decimals={2}
                    duration={800}
                  /> MB
                </div>
                <div className="text-[hsl(var(--accent))] text-sm">Mempool Size</div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Unconfirmed - Bottom Right */}
      <div className="absolute bottom-20 md:bottom-4 right-4 z-10 cursor-pointer" onClick={() => setActiveModal('unconfirmed')}>
        <Card className="premium-card">
          <div className="p-3 text-right">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2 ml-auto shimmer-skeleton" />
                <Skeleton className="h-4 w-28 ml-auto shimmer-skeleton" />
              </>
            ) : (
              <>
                <div className="text-2xl font-mono font-bold text-[hsl(var(--accent))]">
                  <AnimatedNumber
                    value={displayStats.unconfirmed}
                    formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                    duration={800}
                  />
                </div>
                <div className="text-[hsl(var(--accent))] text-sm">Unconfirmed TX</div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ChartModal
        open={activeModal === 'chart'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />

      <FeesModal
        isOpen={activeModal === 'fees'}
        onClose={() => setActiveModal(null)}
        fees={stats?.fees}
      />

      <MempoolModal
        isOpen={activeModal === 'mempool' || activeModal === 'unconfirmed'}
        onClose={() => setActiveModal(null)}
        mempool={stats?.mempool}
      />

      <BlockDetailsModal
        isOpen={activeModal === 'block-height'}
        onClose={() => setActiveModal(null)}
        blockHash={currentBlockHash}
      />
    </>
  )
}
