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
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Reset loading state when symbol changes or modal reopens
  useEffect(() => {
    if (open) {
      setWidgetLoaded(false)
    }
  }, [open, symbol])

  // Detect when TradingView iframe appears in the chart container
  useEffect(() => {
    if (!open || !chartContainerRef.current) return

    let timer: ReturnType<typeof setTimeout>

    const observer = new MutationObserver(() => {
      const iframe = chartContainerRef.current?.querySelector("iframe")
      if (iframe) {
        timer = setTimeout(() => setWidgetLoaded(true), 500)
        observer.disconnect()
      }
    })

    observer.observe(chartContainerRef.current, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [open, symbol])

  const isUSD = symbol === "BTCUSD"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="chart-modal"
        className="max-w-[95vw] w-[95vw] h-[80vh] p-0 gap-0 grid-rows-[auto_1fr] premium-modal text-white"
        originRect={originRect}
      >
        <DialogHeader
          className="px-4 py-3 border-b border-[hsl(var(--border-subtle))]"
          data-stagger-item=""
        >
          <DialogTitle>
            <div className="relative inline-flex rounded-lg bg-[hsl(var(--surface-2))] p-0.5">
              <div
                className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md bg-[hsl(var(--accent)/0.2)] border border-[hsl(var(--accent)/0.3)] transition-[left] duration-200 ease-out"
                style={{ left: isUSD ? "2px" : "calc(50%)" }}
              />
              <button
                className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isUSD
                    ? "text-[hsl(var(--accent))]"
                    : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))]"
                }`}
                onClick={() => setSymbol("BTCUSD")}
              >
                USD
              </button>
              <button
                className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  !isUSD
                    ? "text-[hsl(var(--accent))]"
                    : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))]"
                }`}
                onClick={() => setSymbol("BTCEUR")}
              >
                EUR
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className="relative min-h-0 w-full overflow-hidden"
          ref={chartContainerRef}
          data-stagger-item=""
        >
          {!widgetLoaded && (
            <div className="absolute inset-0 z-10 bg-[hsl(var(--surface-1))] shimmer-skeleton" />
          )}
          <TradingViewWidget symbol={symbol} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
