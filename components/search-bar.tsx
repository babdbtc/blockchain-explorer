"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

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

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-3xl px-2">
      <div className="search-bar-premium">
        <form onSubmit={handleSubmit} className="flex items-center p-1">
          <div className="pl-4 pr-3">
            <Search className="w-5 h-5 text-[hsl(var(--accent))]" />
          </div>
          <Input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TxID or Address..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-[hsl(var(--text-muted))] transition-all duration-150 text-lg font-mono px-2 py-5 caret-[hsl(var(--accent))]"
            autoComplete="off"
            data-1p-ignore
          />
        </form>
      </div>
    </div>
  )
}
