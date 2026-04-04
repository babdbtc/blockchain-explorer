"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ThreeScene } from "@/components/three-scene"
import { StatsStrip } from "@/components/stats-strip"
import { BlockExplorer } from "@/components/block-explorer"
import { SearchModal } from "@/components/search-modal"
import { CashuDonation } from "@/components/cashu-donation"
import { PrivacyGuide } from "@/components/privacy-guide-modal"
import { BottomDock } from "@/components/bottom-dock"
import { SearchBar } from "@/components/search-bar"
import { NetworkStatsHUD } from "@/components/network-stats-hud"
import { NetworkStatsModal } from "@/components/network-stats-modal"
import { ChartModal } from "@/components/chart-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCurrentHeight } from "@/hooks/use-bitcoin-data"
import { useMempoolWebSocket } from "@/hooks/use-websocket"
import { useDifficultyData, useHalvingData } from "@/hooks/use-bitcoin-data"
import { Heart } from "lucide-react"

export function HomeView({ initialQuery }: { initialQuery?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(!!initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery || "")
  const [privacyGuideOpen, setPrivacyGuideOpen] = useState(false)
  const [donationModalOpen, setDonationModalOpen] = useState(false)
  const [networkStatsModalOpen, setNetworkStatsModalOpen] = useState(false)
  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const router = useRouter()

  const { data: currentBlockHeight = 0 } = useCurrentHeight()
  const { data: difficultyData } = useDifficultyData()
  const { data: halvingData } = useHalvingData()

  useMempoolWebSocket()

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
      setIsSearchOpen(true)
    } else {
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }, [initialQuery])

  const handleOpenPrivacyGuide = useCallback(() => {
    setPrivacyGuideOpen(true)
  }, [])

  const handlePrivacyGuideHandled = useCallback(() => {
    setPrivacyGuideOpen(false)
  }, [])

  const handleOpenDonations = useCallback(() => {
    setDonationModalOpen(true)
  }, [])

  const handleOpenNetworkStats = useCallback(() => {
    setNetworkStatsModalOpen(true)
  }, [])

  const handleOpenChart = useCallback(() => {
    setChartModalOpen(true)
  }, [])

  const handleOpenSearch = useCallback(() => {
    // On mobile, open a search input modal
    setMobileSearchOpen(true)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <ThreeScene />

      {/* Top stats strip (replaces corner stat cards) */}
      <StatsStrip blockHeight={currentBlockHeight} />

      {/* Desktop search bar (hidden on mobile, accessible via dock) */}
      <SearchBar />

      {/* Network stats HUD (floating difficulty + halving, desktop only) */}
      <NetworkStatsHUD />

      {/* Block explorer strip */}
      <BlockExplorer currentHeight={currentBlockHeight} />

      {/* Donation panel hidden by default — accessible via dock button */}

      {/* Privacy guide modal (triggered from dock) */}
      <PrivacyGuide
        externalOpen={privacyGuideOpen}
        onExternalOpenHandled={handlePrivacyGuideHandled}
      />

      {/* Bottom dock (macOS-style) */}
      <BottomDock
        onOpenSearch={handleOpenSearch}
        onOpenChart={handleOpenChart}
        onOpenNetworkStats={handleOpenNetworkStats}
        onOpenPrivacyGuide={handleOpenPrivacyGuide}
        onOpenDonations={handleOpenDonations}
      />

      {/* Deep-link search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => router.push("/")}
        query={searchQuery}
      />

      {/* Donation modal (dock-triggered, for mobile and desktop) */}
      <Dialog open={donationModalOpen} onOpenChange={setDonationModalOpen}>
        <DialogContent data-testid="donation-modal" className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-sm max-h-[85vh] overflow-y-auto custom-scrollbar p-0 gap-0">
          <DialogHeader data-stagger-item className="p-4 pb-3 border-b border-[hsl(var(--border-subtle))] bg-[hsl(var(--accent)/0.05)]">
            <DialogTitle className="flex items-center gap-2 text-[hsl(var(--accent))]">
              <Heart className="w-5 h-5" />
              Donate
            </DialogTitle>
          </DialogHeader>
          <div data-stagger-item className="p-2 rounded-b-lg shadow-[0_0_16px_hsl(var(--accent)/0.1)]">
            <CashuDonation modal />
          </div>
        </DialogContent>
      </Dialog>

      {/* Network stats modal (dock-triggered) */}
      {difficultyData && halvingData && (
        <NetworkStatsModal
          isOpen={networkStatsModalOpen}
          onClose={() => setNetworkStatsModalOpen(false)}
          difficultyData={difficultyData}
          halvingData={halvingData}
        />
      )}

      {/* Chart modal (dock-triggered) */}
      <ChartModal
        open={chartModalOpen}
        onOpenChange={setChartModalOpen}
        originRect={null}
      />

      {/* Mobile search modal */}
      <MobileSearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </div>
  )
}

/**
 * Lightweight mobile search modal — just the search input in a dialog.
 */
function MobileSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      // Focus input after dialog animation
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      onClose()
      if (/^[0-9a-fA-F]{64}$/.test(trimmedQuery)) {
        router.push(`/tx/${trimmedQuery}`)
      } else if (/^(1|3|bc1)/.test(trimmedQuery)) {
        router.push(`/address/${trimmedQuery}`)
      } else {
        router.push(`/${trimmedQuery}`)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent data-testid="mobile-search-modal" className="premium-modal text-white w-[calc(100%-1rem)] max-w-lg p-0 gap-0 top-[10%] translate-y-0">
        <form data-stagger-item onSubmit={handleSubmit} className="flex items-center p-3 gap-2">
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TxID or Address..."
            className="flex-1 bg-transparent border border-transparent rounded-lg focus:border-[hsl(var(--accent)/0.6)] focus:shadow-[0_0_0_4px_hsl(var(--accent)/0.1),0_0_24px_hsl(var(--accent)/0.08)] focus:outline-none text-white placeholder-[hsl(var(--text-muted))] text-lg font-mono px-2 py-3 caret-[hsl(var(--accent))] transition-[border-color,box-shadow] duration-300"
            autoComplete="off"
          />
          {/* Query type indicator dot */}
          {query.trim() && (
            <div
              data-stagger-item
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                /^[0-9a-fA-F]{64}$/.test(query.trim())
                  ? "bg-orange-400 shadow-[0_0_6px_theme(colors.orange.400/0.6)]"
                  : /^(1|3|bc1)/.test(query.trim())
                    ? "bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400/0.6)]"
                    : "bg-[hsl(var(--text-muted))]"
              }`}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
