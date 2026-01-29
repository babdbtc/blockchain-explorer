"use client"

import { useEffect } from "react"

export function CursorShine() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.premium-card')

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        if (x >= -20 && x <= 120 && y >= -20 && y <= 120) {
          ;(card as HTMLElement).style.setProperty('--shine-x', `${x}%`)
          ;(card as HTMLElement).style.setProperty('--shine-y', `${y}%`)
        }
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return null
}
