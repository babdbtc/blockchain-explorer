"use client"

import { useState, useEffect, useCallback } from "react"

export type SearchType = "address" | "transaction"

export interface SearchHistoryItem {
  query: string
  type: SearchType
  timestamp: number
}

const STORAGE_KEY = "babd-search-history"
const MAX_ITEMS = 10

function getStoredHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredHistory(history: SearchHistoryItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // localStorage might be full or disabled
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  // Load history on mount (client-side only)
  useEffect(() => {
    setHistory(getStoredHistory())
  }, [])

  const addToHistory = useCallback((query: string, type: SearchType) => {
    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((item) => item.query !== query)
      // Add new item at the beginning
      const newHistory = [{ query, type, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      setStoredHistory(newHistory)
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setStoredHistory([])
  }, [])

  return { history, addToHistory, clearHistory }
}
