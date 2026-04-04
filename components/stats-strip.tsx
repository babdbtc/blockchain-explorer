"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { ChartModal } from "@/components/chart-modal"
import { FeesModal, MempoolModal } from "@/components/stats-modals"
import { BlockDetailsModal } from "@/components/block-details-modal"
import { useBitcoinStats, useRecentBlocks } from "@/hooks/use-bitcoin-data"
import type { OriginRect } from "@/components/ui/dialog"

interface StatsStripProps {
  blockHeight: number
}

type ModalType = "chart" | "fees" | "mempool" | "unconfirmed" | "block-height" | null

export function StatsStrip({ blockHeight }: StatsStripProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [originRect, setOriginRect] = useState<OriginRect | null>(null)
  const [isNewBlock, setIsNewBlock] = useState(false)
  const prevBlockHeightRef = useRef(blockHeight)
  const { data: stats, isLoading } = useBitcoinStats()
  const { data: recentBlocks } = useRecentBlocks()

  const currentBlockHash = recentBlocks?.[0]?.id ?? null

  const openModal = useCallback(
    (modal: ModalType, event: React.MouseEvent) => {
      const target = event.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      setOriginRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      })
      setActiveModal(modal)
    },
    []
  )

  // Allow opening chart modal externally
  const openChartModal = useCallback(() => {
    setOriginRect(null)
    setActiveModal("chart")
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
    setTimeout(() => setOriginRect(null), 300)
  }, [])

  useEffect(() => {
    if (
      prevBlockHeightRef.current !== 0 &&
      blockHeight > prevBlockHeightRef.current
    ) {
      setIsNewBlock(true)
      const timer = setTimeout(() => setIsNewBlock(false), 500)
      return () => clearTimeout(timer)
    }
    prevBlockHeightRef.current = blockHeight
  }, [blockHeight])

  const displayStats = stats || {
    price: 0,
    mempoolSize: 0,
    highPriority: 0,
    unconfirmed: 0,
  }

  return (
    <>
      {/* Stats Strip - Horizontal bar at the top */}
      <div className="absolute top-[4.5rem] md:top-[4.5rem] left-1/2 transform -translate-x-1/2 z-20 px-4">
        <div className="premium-card glow-border rounded-2xl flex items-center justify-center gap-0 md:gap-1 px-1 py-2 md:px-4 md:py-3 w-max max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar mx-auto">
          {/* Price */}
          <button
            className="flex flex-col items-center min-w-0 px-1 md:px-3 py-1 rounded-lg stat-hover cursor-pointer flex-shrink-0"
            data-testid="stat-price"
            onClick={(e) => openModal("chart", e)}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-16 shimmer-skeleton" />
            ) : (
              <div className="text-sm md:text-lg font-mono font-bold text-[hsl(var(--accent))] whitespace-nowrap">
                $
                <AnimatedNumber
                  value={displayStats.price}
                  formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                  duration={800}
                  flash={true}
                />
              </div>
            )}
            <div className="text-[hsl(var(--text-muted))] text-[10px] md:text-xs">
              Price
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[hsl(var(--border-subtle))] flex-shrink-0" />

          {/* High Priority Fee */}
          <button
            className="flex flex-col items-center min-w-0 px-1 md:px-3 py-1 rounded-lg stat-hover cursor-pointer flex-shrink-0"
            data-testid="stat-fees"
            onClick={(e) => openModal("fees", e)}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-16 shimmer-skeleton" />
            ) : (
              <div className="text-sm md:text-lg font-mono font-bold text-[hsl(var(--accent))] whitespace-nowrap">
                <AnimatedNumber
                  value={displayStats.highPriority}
                  formatFn={(val) =>
                    Math.floor(val).toLocaleString("en-US")
                  }
                  duration={800}
                  flash={true}
                />{" "}
                <span className="text-xs md:text-sm">sat/vB</span>
              </div>
            )}
            <div className="text-[hsl(var(--text-muted))] text-[10px] md:text-xs">
              Fees
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[hsl(var(--border-subtle))] flex-shrink-0" />

          {/* Block Height - center piece */}
          <button
            className={`flex flex-col items-center min-w-0 px-1 md:px-4 py-1 rounded-lg stat-hover cursor-pointer flex-shrink-0 ${
              isNewBlock ? "new-block-celebration" : ""
            }`}
            data-testid="stat-blockheight"
            onClick={(e) => {
              if (currentBlockHash) openModal("block-height", e)
            }}
          >
            <div className="text-base md:text-2xl font-mono font-bold block-height-display whitespace-nowrap">
              <AnimatedNumber
                value={blockHeight}
                formatFn={(val) =>
                  Math.floor(val).toLocaleString("en-US")
                }
                duration={800}
                flash={true}
              />
            </div>
            <div className="text-[hsl(var(--accent))] text-[10px] md:text-xs tracking-widest uppercase">
              Block Height
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[hsl(var(--border-subtle))] flex-shrink-0" />

          {/* Mempool Size */}
          <button
            className="flex flex-col items-center min-w-0 px-1 md:px-3 py-1 rounded-lg stat-hover cursor-pointer flex-shrink-0"
            data-testid="stat-mempool"
            onClick={(e) => openModal("mempool", e)}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-16 shimmer-skeleton" />
            ) : (
              <div className="text-sm md:text-lg font-mono font-bold text-[hsl(var(--accent))] whitespace-nowrap">
                <AnimatedNumber
                  value={displayStats.mempoolSize}
                  decimals={2}
                  duration={800}
                  flash={true}
                />{" "}
                <span className="text-xs md:text-sm">MB</span>
              </div>
            )}
            <div className="text-[hsl(var(--text-muted))] text-[10px] md:text-xs">
              Mempool
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[hsl(var(--border-subtle))] flex-shrink-0" />

          {/* Unconfirmed TX */}
          <button
            className="flex flex-col items-center min-w-0 px-1 md:px-3 py-1 rounded-lg stat-hover cursor-pointer flex-shrink-0"
            data-testid="stat-unconfirmed"
            onClick={(e) => openModal("unconfirmed", e)}
          >
            {isLoading ? (
              <Skeleton className="h-5 w-16 shimmer-skeleton" />
            ) : (
              <div className="text-sm md:text-lg font-mono font-bold text-[hsl(var(--accent))] whitespace-nowrap">
                <AnimatedNumber
                  value={displayStats.unconfirmed}
                  formatFn={(val) =>
                    Math.floor(val).toLocaleString("en-US")
                  }
                  duration={800}
                  flash={true}
                />
              </div>
            )}
            <div className="text-[hsl(var(--text-muted))] text-[10px] md:text-xs">
              <span className="md:hidden">Unconf.</span>
              <span className="hidden md:inline">Unconfirmed</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ChartModal
        open={activeModal === "chart"}
        onOpenChange={(open) => !open && closeModal()}
        originRect={originRect}
      />

      <FeesModal
        isOpen={activeModal === "fees"}
        onClose={closeModal}
        fees={stats?.fees}
        originRect={originRect}
      />

      <MempoolModal
        isOpen={activeModal === "mempool" || activeModal === "unconfirmed"}
        onClose={closeModal}
        mempool={stats?.mempool}
        originRect={originRect}
      />

      <BlockDetailsModal
        isOpen={activeModal === "block-height"}
        onClose={closeModal}
        blockHash={currentBlockHash}
        originRect={originRect}
      />
    </>
  )
}
