"use client"

import { useState } from "react"
import { Bitcoin, Zap, Shield, X, Menu } from "lucide-react"
import { CashuDonation } from "./cashu-donation"

interface MobileMenuProps {
  blockHeight: number
  onOpenPrivacyGuide: () => void
}

export function MobileMenu({ blockHeight, onOpenPrivacyGuide }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<"menu" | "donate">("menu")

  const handleClose = () => {
    setIsOpen(false)
    setActivePanel("menu")
  }

  const handleOpenDonate = () => {
    setActivePanel("donate")
  }

  const handleOpenPrivacy = () => {
    handleClose()
    onOpenPrivacyGuide()
  }

  return (
    <div className="md:hidden">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-[hsl(var(--accent))] text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md mx-2 mb-2 rounded-2xl bg-[hsl(var(--surface-1))] border border-[hsl(var(--border-subtle))] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[hsl(var(--border-subtle))]">
              <div className="text-sm font-medium text-[hsl(var(--accent))]">
                {activePanel === "menu" ? "Menu" : "Donations"}
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-[hsl(var(--text-muted))]" />
              </button>
            </div>

            {/* Content */}
            {activePanel === "menu" && (
              <div className="p-3 space-y-2">
                {/* Block Height Display */}
                <div className="text-center py-3">
                  <div className="text-[hsl(var(--text-muted))] text-xs mb-1">Block Height</div>
                  <div className="text-3xl font-mono font-bold text-[hsl(var(--accent))]">
                    {blockHeight.toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={handleOpenDonate}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-2))]/80 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Donate</div>
                    <div className="text-xs text-[hsl(var(--text-muted))]">On-chain, Lightning, or Cashu</div>
                  </div>
                </button>

                <button
                  onClick={handleOpenPrivacy}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--surface-2))] hover:bg-[hsl(var(--surface-2))]/80 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Privacy Guide</div>
                    <div className="text-xs text-[hsl(var(--text-muted))]">Bitcoin privacy techniques</div>
                  </div>
                </button>
              </div>
            )}

            {activePanel === "donate" && (
              <div className="p-2 max-h-[70vh] overflow-y-auto">
                <CashuDonation mobile />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
