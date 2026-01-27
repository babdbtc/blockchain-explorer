"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDifficultyData, useHalvingData } from "@/hooks/use-bitcoin-data"
import { motion } from "framer-motion"
import { NetworkStatsModal } from "@/components/network-stats-modal"
import { MiningStatsModal } from "@/components/mining-stats-modal"
import { BarChart3 } from "lucide-react"

export function NetworkStats() {
  const { data: difficultyData, isLoading: difficultyLoading, error: difficultyError } = useDifficultyData()
  const { data: halvingData, isLoading: halvingLoading, error: halvingError } = useHalvingData()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMiningModalOpen, setIsMiningModalOpen] = useState(false)

  const loading = difficultyLoading || halvingLoading

  if (difficultyError) {
    console.error("Error fetching difficulty data:", difficultyError)
  }

  if (halvingError) {
    console.error("Error fetching halving data:", halvingError)
  }

  if (loading || !difficultyData || !halvingData) {
    return (
      <div className="absolute left-4 top-64 md:top-80 z-10 max-w-xs">
        <Card className="premium-card p-4">
          <div className="text-gray-400 text-xs">Loading...</div>
        </Card>
      </div>
    )
  }

  const baseProgress = (difficultyData.blocksIntoEpoch / 2016) * 100
  const isAhead = difficultyData.difficultyChange > 0
  const extensionPercent = Math.abs(difficultyData.difficultyChange) * 0.5

  return (
    <>
      <div className={`absolute left-4 ${isDesktop ? "bottom-[18rem]" : "bottom-[22rem]"} @[@media(min-height:1000px)]:top-1/2 @[@media(min-height:1000px)]:-translate-y-1/2 @[@media(min-height:1000px)]:bottom-auto min-[2000px]:top-1/2 min-[2000px]:-translate-y-1/2 min-[2000px]:bottom-auto z-5`}>
        <motion.div
          className="max-w-xs height-responsive-scale cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="premium-card p-4">
            <StatsContent
              difficultyData={difficultyData}
              halvingData={halvingData}
              baseProgress={baseProgress}
              isAhead={isAhead}
              extensionPercent={extensionPercent}
              onOpenMiningModal={() => setIsMiningModalOpen(true)}
            />
          </Card>
        </motion.div>
      </div>

      <NetworkStatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        difficultyData={difficultyData}
        halvingData={halvingData}
      />

      <MiningStatsModal
        isOpen={isMiningModalOpen}
        onClose={() => setIsMiningModalOpen(false)}
      />
    </>
  )
}

function StatsContent({ difficultyData, halvingData, baseProgress, isAhead, extensionPercent, onOpenMiningModal }: any) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Difficulty Adjustment Section */}
      <div className="mb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[hsl(var(--accent))] text-xs font-semibold">Difficulty Adjustment</div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenMiningModal()
            }}
            className="premium-button-accent p-1.5 rounded-md"
            title="View Hashrate & Difficulty Chart"
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-2">
          <div className="w-full bg-[hsl(var(--surface-3))] rounded-full h-2 overflow-hidden relative">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(baseProgress, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {baseProgress < 100 && (
              <motion.div
                className={`h-full ${isAhead ? "bg-green-500" : "bg-red-500"} inline-block absolute top-0`}
                style={{ left: `${baseProgress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(extensionPercent, 100 - baseProgress)}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              />
            )}
          </div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-1">
            <AnimatedNumber
              value={difficultyData.blocksIntoEpoch}
              formatFn={(val) => Math.floor(val).toString()}
              duration={800}
            /> / 2016 blocks
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Avg block time</span>
            <span className="text-white font-mono font-medium">
              ~<AnimatedNumber
                value={difficultyData.averageBlockTime}
                decimals={1}
                duration={800}
              /> min
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Difficulty</span>
            <span
              className={`font-mono font-medium ${difficultyData.difficultyChange > 0 ? "text-green-400" : "text-red-400"}`}
            >
              {difficultyData.difficultyChange > 0 ? "+" : ""}
              <AnimatedNumber
                value={difficultyData.difficultyChange}
                decimals={2}
                duration={800}
              />%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Previous</span>
            <span className={`font-mono font-medium ${difficultyData.previousChange > 0 ? "text-green-400" : "text-red-400"}`}>
              {difficultyData.previousChange > 0 ? "+" : ""}
              <AnimatedNumber
                value={difficultyData.previousChange}
                decimals={2}
                duration={800}
              />%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Next retarget</span>
            <span className="text-white font-mono font-medium text-right">{difficultyData.estimatedRetarget}</span>
          </div>
        </div>
      </div>

      <Separator className="my-2 bg-[hsl(var(--border-subtle))]" />

      {/* Halving Countdown Section */}
      <div>
        <div className="text-[hsl(var(--accent))] text-xs font-semibold mb-2">Halving Countdown</div>

        {/* Progress Bar */}
        <div className="relative mb-2">
          <div className="w-full bg-[hsl(var(--surface-3))] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(48_96%_65%)]"
              initial={{ width: 0 }}
              animate={{ width: `${halvingData.progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-1">
            <AnimatedNumber
              value={halvingData.progressPercent}
              decimals={2}
              duration={800}
            />% complete
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Current subsidy</span>
            <span className="text-white font-mono font-medium">{halvingData.currentSubsidy} BTC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">New subsidy</span>
            <span className="text-white font-mono font-medium">
              {halvingData.currentSubsidy === 3.125
                ? "1.5625 BTC"
                : `${halvingData.newSubsidy.toFixed(3)} BTC`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Blocks remaining</span>
            <span className="text-white font-mono font-medium">
              <AnimatedNumber
                value={halvingData.blocksRemaining}
                formatFn={(val) => Math.floor(val).toLocaleString("en-US")}
                duration={800}
              />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[hsl(var(--text-muted))]">Estimated date</span>
            <span className="text-white font-mono font-medium text-right">{halvingData.estimatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
