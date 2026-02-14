"use client"

import { useDifficultyData, useHalvingData } from "@/hooks/use-bitcoin-data"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { motion } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  SVG Circular Progress Ring                                         */
/* ------------------------------------------------------------------ */

interface CircularProgressProps {
  /** 0–100 */
  percent: number
  /** Ring diameter in px */
  size?: number
  /** Stroke width in px */
  strokeWidth?: number
  /** Main colour (CSS colour string) */
  color: string
  /** Optional second colour segment drawn after `percent` */
  extensionPercent?: number
  extensionColor?: string
  /** Whether the extension represents being ahead (true) or behind (false) */
  extensionAhead?: boolean
  /** Content rendered inside the ring */
  children?: React.ReactNode
}

function CircularProgress({
  percent,
  size = 140,
  strokeWidth = 6,
  color,
  extensionPercent = 0,
  extensionColor,
  extensionAhead = false,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filledLength = (Math.min(percent, 100) / 100) * circumference
  const mainOffset = circumference - filledLength
  const extLength = (Math.min(extensionPercent, 100 - percent) / 100) * circumference

  // Pulse: a short bright segment that sweeps the filled arc
  // When ahead (green extension): pulse sweeps through blue + green
  // When behind (red extension): pulse only sweeps the blue arc
  const pulseTargetLength = extensionAhead ? filledLength + extLength : filledLength
  const pulseSize = Math.max(pulseTargetLength * 0.10, 6)
  const pulseGap = circumference - pulseSize
  const pulseTargetOffset = circumference - pulseTargetLength
  const pulseEndOffset = pulseTargetOffset + pulseSize

  return (
    <div className="relative overflow-visible" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block -rotate-90" overflow="visible">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(0 0% 100% / 0.07)"
          strokeWidth={strokeWidth}
        />

        {/* Main arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: mainOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />

        {/* Optional extension arc (difficulty ahead/behind) */}
        {extensionPercent > 0 && extensionColor && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={extensionColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${extLength} ${circumference - extLength}`}
            strokeDashoffset={mainOffset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ filter: `drop-shadow(0 0 4px ${extensionColor})` }}
          />
        )}

        {/* Pulse sweep — bright dot travelling along the filled arc (rendered last, on top) */}
        {pulseTargetLength > 10 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            strokeDasharray={`${pulseSize} ${pulseGap}`}
            animate={{
              strokeDashoffset: [circumference, circumference, pulseEndOffset, pulseEndOffset],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 3,
              times: [0, 0.06, 0.78, 1],
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 3px ${color})`,
            }}
          />
        )}
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Glow text utility                                                  */
/* ------------------------------------------------------------------ */

const glowStyle: React.CSSProperties = {
  textShadow: "0 0 12px hsl(48 96% 72% / 0.45), 0 0 40px hsl(48 96% 72% / 0.15)",
}

const subtleGlow: React.CSSProperties = {
  textShadow: "0 0 8px hsl(0 0% 100% / 0.25)",
}

/* ------------------------------------------------------------------ */
/*  Main HUD component                                                 */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Shared stat rows                                                    */
/* ------------------------------------------------------------------ */

function DifficultyStats({ difficultyData, isAhead }: { difficultyData: any; isAhead: boolean }) {
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Avg block</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          ~<AnimatedNumber value={difficultyData.averageBlockTime} decimals={1} duration={800} />{" "}
          min
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Difficulty</span>
        <span
          className={`text-sm font-mono font-medium ${isAhead ? "text-green-400" : "text-red-400"}`}
          style={subtleGlow}
        >
          {isAhead ? "+" : ""}
          <AnimatedNumber value={difficultyData.difficultyChange} decimals={2} duration={800} />%
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Previous</span>
        <span
          className={`text-sm font-mono font-medium ${difficultyData.previousChange > 0 ? "text-green-400" : "text-red-400"}`}
          style={subtleGlow}
        >
          {difficultyData.previousChange > 0 ? "+" : ""}
          <AnimatedNumber value={difficultyData.previousChange} decimals={2} duration={800} />%
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Retarget</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          {difficultyData.estimatedRetarget}
        </span>
      </div>
    </>
  )
}

function HalvingStats({ halvingData }: { halvingData: any }) {
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Subsidy</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          {halvingData.currentSubsidy} BTC
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Next</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          {halvingData.currentSubsidy === 3.125
            ? "1.5625"
            : halvingData.newSubsidy.toFixed(4)}{" "}
          BTC
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Remaining</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          <AnimatedNumber
            value={halvingData.blocksRemaining}
            formatFn={(v) => Math.floor(v).toLocaleString("en-US")}
            duration={800}
          />
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[hsl(0_0%_55%)] text-sm">Est. date</span>
        <span className="text-white text-sm font-mono font-medium" style={subtleGlow}>
          {halvingData.estimatedDate}
        </span>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main HUD component                                                 */
/* ------------------------------------------------------------------ */

export function NetworkStatsHUD() {
  const { data: difficultyData, isLoading: dL } = useDifficultyData()
  const { data: halvingData, isLoading: hL } = useHalvingData()

  if (dL || hL || !difficultyData || !halvingData) return null

  const epochProgress = (difficultyData.blocksIntoEpoch / 2016) * 100
  const isAhead = difficultyData.difficultyChange > 0
  const extensionPercent = Math.abs(difficultyData.difficultyChange) * 0.5

  return (
    <>
      {/* ============================================================ */}
      {/*  Mobile layout — stacked vertically, centered                */}
      {/* ============================================================ */}
      <div className="lg:hidden absolute inset-0 z-5 pointer-events-none px-6 pt-[7.5rem] pb-[12rem] flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-3 w-full max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Difficulty Adjustment */}
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 bg-[hsl(0_0%_8%/0.55)] backdrop-blur-md border border-[hsl(0_0%_100%/0.06)] overflow-visible">
            <CircularProgress
              percent={epochProgress}
              color="#3b82f6"
              extensionPercent={extensionPercent}
              extensionColor={isAhead ? "#22c55e" : "#ef4444"}
              extensionAhead={isAhead}
              size={100}
              strokeWidth={6}
            >
              <span className="text-lg font-bold font-mono text-white tabular-nums" style={subtleGlow}>
                <AnimatedNumber
                  value={difficultyData.blocksIntoEpoch}
                  formatFn={(v) => Math.floor(v).toLocaleString("en-US")}
                  duration={800}
                />
              </span>
              <span className="text-[9px] text-[hsl(0_0%_55%)] font-mono">/ 2,016</span>
            </CircularProgress>

            <div className="space-y-1 select-none">
              <h3
                className="text-base font-semibold tracking-tight text-[hsl(var(--accent))]"
                style={glowStyle}
              >
                Difficulty Adjustment
              </h3>
              <DifficultyStats difficultyData={difficultyData} isAhead={isAhead} />
            </div>
          </div>

          {/* Halving Countdown */}
          <div className="flex items-center gap-4 rounded-2xl px-5 py-4 bg-[hsl(0_0%_8%/0.55)] backdrop-blur-md border border-[hsl(0_0%_100%/0.06)] overflow-visible">
            <CircularProgress
              percent={halvingData.progressPercent}
              color="hsl(48 96% 72%)"
              size={100}
              strokeWidth={6}
            >
              <span className="text-lg font-bold font-mono text-white tabular-nums" style={subtleGlow}>
                <AnimatedNumber value={halvingData.progressPercent} decimals={1} duration={800} />
                <span className="text-xs">%</span>
              </span>
              <span className="text-[9px] text-[hsl(0_0%_55%)] font-mono">complete</span>
            </CircularProgress>

            <div className="space-y-1 select-none">
              <h3
                className="text-base font-semibold tracking-tight text-[hsl(var(--accent))]"
                style={glowStyle}
              >
                Halving Countdown
              </h3>
              <HalvingStats halvingData={halvingData} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/*  Desktop layout — top-left & top-right                       */}
      {/* ============================================================ */}
      <div className="hidden lg:block pointer-events-none">
        {/* ---------- Difficulty Adjustment — top-left ---------- */}
        <motion.div
          className="absolute left-6 top-4 z-5 flex items-start gap-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CircularProgress
            percent={epochProgress}
            color="#3b82f6"
            extensionPercent={extensionPercent}
            extensionColor={isAhead ? "#22c55e" : "#ef4444"}
            extensionAhead={isAhead}
            size={130}
            strokeWidth={7}
          >
            <span
              className="text-2xl font-bold font-mono text-white tabular-nums"
              style={subtleGlow}
            >
              <AnimatedNumber
                value={difficultyData.blocksIntoEpoch}
                formatFn={(v) => Math.floor(v).toLocaleString("en-US")}
                duration={800}
              />
            </span>
            <span className="text-[11px] text-[hsl(0_0%_55%)] font-mono">/ 2,016</span>
          </CircularProgress>

          <div className="space-y-1.5 select-none">
            <h3
              className="text-lg font-semibold tracking-tight text-[hsl(var(--accent))]"
              style={glowStyle}
            >
              Difficulty Adjustment
            </h3>
            <DifficultyStats difficultyData={difficultyData} isAhead={isAhead} />
          </div>
        </motion.div>

        {/* ---------- Halving Countdown — top-right ---------- */}
        <motion.div
          className="absolute right-6 top-4 z-5 flex items-start gap-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <div className="space-y-1.5 text-right select-none">
            <h3
              className="text-lg font-semibold tracking-tight text-[hsl(var(--accent))]"
              style={glowStyle}
            >
              Halving Countdown
            </h3>
            <div className="flex flex-col items-end">
              <HalvingStats halvingData={halvingData} />
            </div>
          </div>

          <CircularProgress
            percent={halvingData.progressPercent}
            color="hsl(48 96% 72%)"
            size={130}
            strokeWidth={7}
          >
            <span
              className="text-2xl font-bold font-mono text-white tabular-nums"
              style={subtleGlow}
            >
              <AnimatedNumber value={halvingData.progressPercent} decimals={1} duration={800} />
              <span className="text-base">%</span>
            </span>
            <span className="text-[11px] text-[hsl(0_0%_55%)] font-mono">complete</span>
          </CircularProgress>
        </motion.div>
      </div>
    </>
  )
}
