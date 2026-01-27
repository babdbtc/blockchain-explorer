"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <Card className="premium-card p-6 max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[hsl(var(--accent))] mb-4">Something went wrong</h2>
              <p className="text-[hsl(var(--text-muted))] mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent-muted))] text-black"
              >
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
