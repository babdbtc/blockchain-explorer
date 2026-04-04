"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface AnimatedNumberProps {
  value: number
  className?: string
  decimals?: number
  duration?: number
  formatFn?: (value: number) => string
  flash?: boolean
}

export function AnimatedNumber({
  value,
  className = "",
  decimals = 0,
  duration = 1000,
  formatFn,
  flash = false,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValueRef = useRef(value)
  const animationFrameRef = useRef<number>(0)
  const [isFlashing, setIsFlashing] = useState(false)
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashPrevRef = useRef(value)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const startValue = prevValueRef.current
    const endValue = value

    // Skip rAF animation when user prefers reduced motion
    if (shouldReduceMotion) {
      setDisplayValue(endValue)
      prevValueRef.current = endValue
      return
    }

    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        prevValueRef.current = endValue
      }
    }

    if (Math.abs(endValue - startValue) > 0.01) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      setDisplayValue(endValue)
      prevValueRef.current = endValue
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [value, duration, shouldReduceMotion])

  useEffect(() => {
    if (flash && Math.abs(value - flashPrevRef.current) > 0.01 && !shouldReduceMotion) {
      setIsFlashing(true)
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
      }
      flashTimeoutRef.current = setTimeout(() => {
        setIsFlashing(false)
      }, 600)
    }
    flashPrevRef.current = value

    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current)
      }
    }
  }, [value, flash, shouldReduceMotion])

  const formattedValue = formatFn
    ? formatFn(displayValue)
    : displayValue.toFixed(decimals)

  return (
    <span
      className={`tabular-nums ${isFlashing ? "value-flash" : ""} ${className}`}
      data-testid="animated-number"
    >
      {formattedValue}
    </span>
  )
}
