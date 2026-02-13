"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ThreeScene } from "@/components/three-scene"
import { StatsPanel } from "@/components/stats-panel"
import { BlockExplorer } from "@/components/block-explorer"
import { SearchModal } from "@/components/search-modal"
import { CashuDonation } from "@/components/cashu-donation"
import { PrivacyGuide } from "@/components/privacy-guide-modal"
import { MobileMenu } from "@/components/mobile-menu"
import { SearchBar } from "@/components/search-bar"
import { NetworkStats } from "@/components/network-stats"
import { useCurrentHeight } from "@/hooks/use-bitcoin-data"
import { useMempoolWebSocket } from "@/hooks/use-websocket"

export function HomeView({ initialQuery }: { initialQuery?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(!!initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery || "")
  const [privacyGuideOpen, setPrivacyGuideOpen] = useState(false)
  const router = useRouter()

  const { data: currentBlockHeight = 0 } = useCurrentHeight()

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0d0f]">
      <ThreeScene />
      <NetworkStats />
      <StatsPanel blockHeight={currentBlockHeight} />
      <BlockExplorer currentHeight={currentBlockHeight} />
      <SearchBar />
      <PrivacyGuide externalOpen={privacyGuideOpen} onExternalOpenHandled={handlePrivacyGuideHandled} />
      <CashuDonation />
      <MobileMenu blockHeight={currentBlockHeight} onOpenPrivacyGuide={handleOpenPrivacyGuide} />
      <SearchModal isOpen={isSearchOpen} onClose={() => router.push("/")} query={searchQuery} />
    </div>
  )
}
