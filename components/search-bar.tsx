"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, History, Wallet, Activity, Trash2 } from "lucide-react"
import { useSearchHistory } from "@/hooks/use-search-history"
import { AnimatePresence, motion } from "framer-motion"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const router = useRouter()
  const { history, clearHistory } = useSearchHistory()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHistoryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      if (/^[0-9a-fA-F]{64}$/.test(trimmedQuery)) {
        router.push(`/tx/${trimmedQuery}`)
      } else if (/^(1|3|bc1)/.test(trimmedQuery)) {
        router.push(`/address/${trimmedQuery}`)
      } else {
        // Fallback for other queries, or show an error
        router.push(`/${trimmedQuery}`)
      }
    }
  }

  const handleHistoryClick = (historyQuery: string, type: string) => {
    setHistoryOpen(false)
    if (type === "transaction") {
      router.push(`/tx/${historyQuery}`)
    } else {
      router.push(`/address/${historyQuery}`)
    }
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="absolute top-[5.5rem] md:top-[7rem] left-1/2 transform -translate-x-1/2 z-20 w-full px-4" data-testid="search-container">
      <div className="search-bar-premium relative" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="flex items-center p-1 relative z-[2]">
          <div className="pl-4 pr-3 relative">
            <Search
              className={`w-5 h-5 transition-all duration-300 ${
                isFocused
                  ? "text-[hsl(var(--accent))]"
                  : "text-[hsl(var(--accent)/0.5)]"
              }`}
            />
          </div>

          {/* Query type indicator dot */}
          {query.trim() && (
            <div className="flex items-center pr-2">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  /^[0-9a-fA-F]{64}$/.test(query.trim())
                    ? "bg-orange-400 shadow-[0_0_6px_theme(colors.orange.400/0.6)]"
                    : /^(1|3|bc1)/.test(query.trim())
                      ? "bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400/0.6)]"
                      : "bg-[hsl(var(--text-muted))]"
                }`}
              />
            </div>
          )}

          <Input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search TxID or Address..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-[hsl(var(--text-muted))] transition-all duration-150 text-lg font-mono px-2 py-5 caret-[hsl(var(--accent))]"
            autoComplete="off"
            data-1p-ignore
            data-testid="search-input"
          />

          <button
            type="button"
            onClick={() => setHistoryOpen(!historyOpen)}
            className="pr-4 pl-2 py-2 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--accent))] transition-colors"
            title="Recent searches"
          >
            <History className="w-5 h-5" />
          </button>
        </form>

        {/* History Dropdown */}
        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[hsl(var(--surface-2))] border border-[hsl(var(--border-subtle))] rounded-lg shadow-xl overflow-hidden"
            >
              {history.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[hsl(var(--text-muted))] text-center">
                  No recent searches
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border-subtle))]">
                    <span className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-wide">Recent Searches</span>
                    <button
                      onClick={() => {
                        clearHistory()
                        setHistoryOpen(false)
                      }}
                      className="text-xs text-[hsl(var(--text-muted))] hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {history.map((item, index) => (
                      <motion.div
                        key={`${item.query}-${index}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleHistoryClick(item.query, item.type)}
                          className="w-full px-4 py-3 hover:bg-[hsl(var(--surface-3))] transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {item.type === "address" ? (
                              <Wallet className="w-4 h-4 text-[hsl(var(--accent))] flex-shrink-0" />
                            ) : (
                              <Activity className="w-4 h-4 text-[hsl(var(--accent))] flex-shrink-0" />
                            )}
                            <span className="text-xs text-[hsl(var(--text-muted))]">
                              {item.type === "transaction" ? "Transaction" : "Address"}
                            </span>
                            <span className="text-xs text-[hsl(var(--text-muted))/0.6] ml-auto">
                              {formatRelativeTime(item.timestamp)}
                            </span>
                          </div>
                          <div className="font-mono text-sm text-white break-all pl-6">
                            {item.query}
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
