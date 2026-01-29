import React from "react";
import { Badge } from "@/components/ui/badge";
import { Block, ProjectedBlock } from "@/lib/types";
import { motion } from "framer-motion";

interface BlockItemProps {
  block: Block | ProjectedBlock;
  currentHeight: number;
  isProjected: boolean;
  scale: number;
  zIndex: number;
  onClick: (block: Block | ProjectedBlock, event?: React.MouseEvent) => void;
  formatTimeAgo?: (timestamp: number) => string;
  getEstimatedTime?: (indexInReversedArray: number) => string;
  getAverageFeeRate?: (feeRange: number[]) => string;
  getInterpolatedFeeColor?: (feeRate: number, alpha?: number) => string;
  index: number;
  futureHeight?: number;
  blockCenterX?: number;
  viewportCenterX?: number;
}

const MAX_BLOCK_WEIGHT_WU = 4000000;
const BYTES_TO_WU_RATIO = 4;

export const BlockItem = React.memo(
  ({
    block,
    currentHeight,
    isProjected,
    scale,
    zIndex,
    onClick,
    formatTimeAgo,
    getEstimatedTime,
    getAverageFeeRate,
    getInterpolatedFeeColor,
    index,
    futureHeight,
  }: BlockItemProps) => {
    const blockWeight = (block as Block).weight;
    const weightPercentage = blockWeight
      ? Math.min((blockWeight / MAX_BLOCK_WEIGHT_WU) * 100, 100)
      : 0;

    if (isProjected) {
      const proj = block as ProjectedBlock;
      const displayHeight = futureHeight || currentHeight + (index || 0);
      const estimatedWeightWU = proj.blockSize * BYTES_TO_WU_RATIO;
      const projectedWeightPercentage = estimatedWeightWU
        ? Math.min((estimatedWeightWU / MAX_BLOCK_WEIGHT_WU) * 100, 100)
        : 0;

      const estimatedFeeRate = Number.parseFloat(
        (getAverageFeeRate?.(proj.feeRange) || "~1").replace("~", "")
      );
      const interpolatedFillColor = getInterpolatedFeeColor?.(estimatedFeeRate, 0.4) || "rgba(0,0,0,0.4)";
      const interpolatedTextColor = getInterpolatedFeeColor?.(estimatedFeeRate) || "white";

      return (
        <motion.div
          layoutId={`block-${displayHeight}`}
          onClick={(e) => onClick(proj, e)}
          className="relative flex-shrink-0 p-3 rounded-xl border text-center min-w-[100px] cursor-pointer overflow-hidden bg-[hsl(var(--surface-1))]"
          title={`Click to view estimated details for future block ${displayHeight}`}
          style={{
            zIndex: zIndex,
            borderColor: `${interpolatedFillColor.replace('0.4)', '0.3)')}`,
          }}
          animate={{ scale: scale }}
          whileHover={{
            scale: scale * 1.02,
            y: -2,
            zIndex: zIndex + 10,
          }}
          whileTap={{ scale: scale * 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {/* Dynamic fill layer for future blocks */}
          <motion.div
            className="absolute bottom-0 left-0 w-full rounded-b-xl"
            initial={{ height: 0 }}
            animate={{
              height: `${projectedWeightPercentage}%`,
              backgroundColor: interpolatedFillColor
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Content layer */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="text-xl font-mono font-bold mb-1" style={{ color: interpolatedTextColor }}>
                {displayHeight}
              </div>
              <div className="text-xs text-white space-y-1">
                <div>{(proj.blockSize / 1000000).toFixed(2)} MB</div>
                <div>{proj.nTx.toLocaleString()} TX</div>
                <div className="text-[hsl(var(--text-muted))]">
                  {getAverageFeeRate?.(proj.feeRange) || "~1"} sat/vB
                </div>
              </div>
            </div>
            <Badge
              className="mt-2 text-white text-xs self-center"
              style={{ backgroundColor: interpolatedTextColor }}
            >
              in {getEstimatedTime?.(index || 0)}
            </Badge>
          </div>
        </motion.div>
      );
    } else {
      // Past blocks
      const blockData = block as Block;
      const isCurrentBlock = blockData.height === currentHeight;

      return (
        <motion.div
          layoutId={`block-${blockData.height}`}
          onClick={(e) => onClick(blockData, e)}
          className={`relative flex-shrink-0 p-3 rounded-xl border text-center min-w-[100px] cursor-pointer overflow-hidden bg-[hsl(var(--surface-1))] ${isCurrentBlock ? "current-block" : ""}`}
          title={`Click to view details for block ${blockData.height}`}
          style={{
            zIndex: zIndex,
            borderColor: isCurrentBlock ? "hsl(217 91% 60% / 0.5)" : "hsl(217 91% 60% / 0.3)",
          }}
          animate={{ scale: scale }}
          whileHover={{
            scale: scale * 1.02,
            y: -2,
            zIndex: zIndex + 10,
            borderColor: "hsl(217 91% 60%)",
          }}
          whileTap={{ scale: scale * 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {/* Animated border glow for current block */}
          {isCurrentBlock && (
            <div className="current-block-glow-container">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Soft outer glow */}
                <rect
                  className="glow-rect glow-rect-soft"
                  x="0" y="0" width="100" height="100"
                  rx="12" ry="12"
                  pathLength={200}
                />
                {/* Medium glow */}
                <rect
                  className="glow-rect glow-rect-outer"
                  x="0" y="0" width="100" height="100"
                  rx="12" ry="12"
                  pathLength={200}
                />
                {/* Bright core */}
                <rect
                  className="glow-rect glow-rect-main"
                  x="0" y="0" width="100" height="100"
                  rx="12" ry="12"
                  pathLength={200}
                />
              </svg>
            </div>
          )}
          {/* Blue fill layer */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-blue-500/40 rounded-b-xl"
            initial={{ height: 0 }}
            animate={{ height: `${weightPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Content layer */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="text-xl font-mono font-bold text-blue-400 mb-1">{blockData.height}</div>
              <div className="text-xs text-white space-y-1">
                <div>{(blockData.size / 1000000).toFixed(2)} MB</div>
                <div>{blockData.tx_count.toLocaleString()} TX</div>
                <div className="text-[hsl(var(--text-muted))]">
                  {blockData.weight ? `${(blockData.weight / 1000000).toFixed(2)} MWU` : "-- MWU"}
                </div>
              </div>
            </div>
            <Badge className="mt-2 bg-blue-500 text-white text-xs self-center hover:bg-blue-500">
              {formatTimeAgo?.(blockData.timestamp)}
            </Badge>
          </div>
        </motion.div>
      );
    }
  }
);

BlockItem.displayName = "BlockItem";
