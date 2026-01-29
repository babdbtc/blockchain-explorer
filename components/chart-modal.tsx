"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, type OriginRect } from "@/components/ui/dialog"
import TradingViewWidget from "@/components/tradingview-widget"

interface ChartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originRect?: OriginRect | null
}

export function ChartModal({ open, onOpenChange, originRect }: ChartModalProps) {
  const [symbol, setSymbol] = useState<"BTCUSD" | "BTCEUR">("BTCUSD")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[80vh] p-0 premium-modal text-white" originRect={originRect}>
        <DialogHeader className="pt-2 pb-0 px-2">
          <DialogTitle className="pt-0 pb-0">
            {/* Symbol toggle */}
            <div className="px-0 pb-0">
              <div className="inline-flex rounded-md border border-[hsl(var(--border-subtle))] overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm transition-colors ${symbol === "BTCUSD" ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]" : "text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-2))]"}`}
                  onClick={() => setSymbol("BTCUSD")}
                >
                  USD
                </button>
                <button
                  className={`px-3 py-1 text-sm border-l border-[hsl(var(--border-subtle))] transition-colors ${symbol === "BTCEUR" ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]" : "text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-2))]"}`}
                  onClick={() => setSymbol("BTCEUR")}
                >
                  EUR
                </button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="h-[calc(80vh-28px)] w-full">
          <TradingViewWidget symbol={symbol} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
