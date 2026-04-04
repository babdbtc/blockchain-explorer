"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, type OriginRect } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Zap, TrendingUp, Clock, Timer } from "lucide-react"
import type { MempoolInfoResponse, RecommendedFeesResponse } from "@/lib/types"

interface FeesModalProps {
    isOpen: boolean
    onClose: () => void
    fees?: RecommendedFeesResponse
    originRect?: OriginRect | null
}

export function FeesModal({ isOpen, onClose, fees, originRect }: FeesModalProps) {
    if (!fees) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent data-testid="fees-modal" className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-sm" originRect={originRect}>
                <DialogHeader>
                    <DialogTitle className="text-[hsl(var(--accent))]">Recommended Fees</DialogTitle>
                    <DialogDescription className="text-[hsl(var(--text-muted))]">
                        Current fee rates in sat/vB
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div data-stagger-item className="flex justify-between items-center p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--accent))]">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[hsl(var(--accent))] shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[hsl(var(--accent))] font-bold">High Priority</span>
                                <span className="text-xs text-[hsl(var(--text-muted))]">Next block</span>
                            </div>
                        </div>
                        <span className="text-2xl font-mono tabular-nums text-white">{fees.fastestFee}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between items-center p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] border-l-2 border-l-yellow-400">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-yellow-400 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-yellow-400 font-bold">Medium Priority</span>
                                <span className="text-xs text-[hsl(var(--text-muted))]">~30 minutes</span>
                            </div>
                        </div>
                        <span className="text-2xl font-mono tabular-nums text-white">{fees.halfHourFee}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between items-center p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] border-l-2 border-l-blue-400">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-blue-400 font-bold">Low Priority</span>
                                <span className="text-xs text-[hsl(var(--text-muted))]">~1 hour</span>
                            </div>
                        </div>
                        <span className="text-2xl font-mono tabular-nums text-white">{fees.hourFee}</span>
                    </div>
                    <div data-stagger-item className="flex justify-between items-center p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] border-l-2 border-l-[hsl(var(--text-muted))]">
                        <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-[hsl(var(--text-muted))] shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[hsl(var(--text-muted))] font-bold">No Priority</span>
                                <span className="text-xs text-[hsl(var(--text-muted))]">Economy</span>
                            </div>
                        </div>
                        <span className="text-2xl font-mono tabular-nums text-white">{fees.economyFee}</span>
                    </div>
                    <div className="text-xs text-center text-[hsl(var(--text-muted))] pt-2">
                        Minimum relay fee: {fees.minimumFee} sat/vB
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface MempoolModalProps {
    isOpen: boolean
    onClose: () => void
    mempool?: MempoolInfoResponse
    originRect?: OriginRect | null
}

export function MempoolModal({ isOpen, onClose, mempool, originRect }: MempoolModalProps) {
    if (!mempool) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent data-testid="mempool-modal" className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-sm" originRect={originRect}>
                <DialogHeader>
                    <DialogTitle className="text-[hsl(var(--accent))]">Mempool Status</DialogTitle>
                    <DialogDescription className="text-[hsl(var(--text-muted))]">
                        Current state of unconfirmed transactions
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div data-stagger-item className="p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] text-center">
                            <div className="text-xs text-[hsl(var(--text-muted))] mb-1">Transaction Count</div>
                            <div className="text-xl font-mono tabular-nums text-white">{mempool.count.toLocaleString()}</div>
                        </div>
                        <div data-stagger-item className="p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))] text-center">
                            <div className="text-xs text-[hsl(var(--text-muted))] mb-1">Total Size</div>
                            <div className="text-xl font-mono tabular-nums text-white">{(mempool.vsize / 1000000).toFixed(2)} MB</div>
                        </div>
                    </div>

                    <div data-stagger-item className="p-3 bg-[hsl(var(--surface-2))] rounded-lg border border-[hsl(var(--border-subtle))]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[hsl(var(--text-muted))]">Total Fees</span>
                            <span className="text-sm font-mono tabular-nums text-[hsl(var(--accent))]">{(mempool.total_fee || 0).toLocaleString()} sats</span>
                        </div>
                        <div className="text-xs text-[hsl(var(--text-muted))] text-center mt-2">
                            Waiting to be mined in upcoming blocks
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
