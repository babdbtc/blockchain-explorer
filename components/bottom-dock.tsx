"use client"

import { useRef, useCallback, useState } from "react"
import { Dock, DockIcon } from "@/components/ui/dock"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BarChart3,
  Activity,
  Shield,
  Heart,
} from "lucide-react"

interface BottomDockProps {
  onOpenSearch: () => void
  onOpenChart: () => void
  onOpenNetworkStats: () => void
  onOpenPrivacyGuide: () => void
  onOpenDonations: () => void
}

const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com/babdcs",
    icon: () => (
      <img src="/images/twitter.png" alt="X" className="size-4 rounded-sm" />
    ),
  },
  {
    label: "Nostr",
    href: "https://njump.me/npub1d3h6cxpz9y9f20c5rg08hgadjtns4stmyqw75q8spssdp46r635q33wvj0",
    icon: () => (
      <img src="/images/nostr-icon-grey.png" alt="Nostr" className="size-4 rounded-sm" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/babdbtc",
    icon: () => (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
]

const NAV_ITEMS = [
  {
    label: "Price Chart",
    icon: BarChart3,
    action: "chart" as const,
  },
  {
    label: "Network Stats",
    icon: Activity,
    action: "networkStats" as const,
  },
  {
    label: "Privacy Guide",
    icon: Shield,
    action: "privacyGuide" as const,
  },
]

/** Shared icon button style — subtle hover like erik.day */
const iconButtonClass =
  "inline-flex items-center justify-center size-12 rounded-full transition-colors text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"

export function BottomDock({
  onOpenSearch,
  onOpenChart,
  onOpenNetworkStats,
  onOpenPrivacyGuide,
  onOpenDonations,
}: BottomDockProps) {
  const shineRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!shineRef.current) return
    const parent = shineRef.current.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    shineRef.current.style.setProperty("--dock-shine-x", `${x}%`)
    shineRef.current.style.setProperty("--dock-shine-y", `${y}%`)
  }, [])

  const handleAction = (action: string) => {
    switch (action) {
      case "search":
        onOpenSearch()
        break
      case "chart":
        onOpenChart()
        break
      case "networkStats":
        onOpenNetworkStats()
        break
      case "privacyGuide":
        onOpenPrivacyGuide()
        break
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-[58px]">
      {/* Backdrop blur gradient — fades content behind dock */}
      <div className="fixed bottom-0 inset-x-0 h-16 w-full backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)]" />

      <TooltipProvider delayDuration={0}>
        <div
          className="relative z-50 pointer-events-auto mx-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Shine overlay — sits on top of the dock, tracks mouse */}
          <div
            ref={shineRef}
            className="absolute inset-0 rounded-full pointer-events-none z-10 overflow-hidden transition-opacity duration-250"
            style={{
              opacity: isHovered ? 1 : 0,
              ["--dock-shine-x" as string]: "50%",
              ["--dock-shine-y" as string]: "50%",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse 25% 80% at var(--dock-shine-x) var(--dock-shine-y), rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, transparent 80%)",
              }}
            />
          </div>

          <Dock
            magnification={60}
            distance={140}
            direction="middle"
            className="relative transform-gpu"
          >
            {/* Navigation items */}
            {NAV_ITEMS.map((item) => (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleAction(item.action)}
                      className={iconButtonClass}
                    >
                      <item.icon className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={10}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}

            <Separator orientation="vertical" className="h-full" />

            {/* Donate */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onOpenDonations}
                    className={iconButtonClass}
                  >
                    <Heart className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  <p>Donate</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <Separator orientation="vertical" className="h-full py-2" />

            {/* Social links */}
            {SOCIAL_LINKS.map((link) => (
              <DockIcon key={link.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={iconButtonClass}
                    >
                      <link.icon />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={10}>
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
          </Dock>
        </div>
      </TooltipProvider>
    </div>
  )
}
