"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Context for sharing origin rect between components
export interface OriginRect {
  x: number
  y: number
  width: number
  height: number
}

const DialogOriginContext = React.createContext<OriginRect | null>(null)

export function useDialogOrigin() {
  return React.useContext(DialogOriginContext)
}

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  originRect?: OriginRect | null
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, originRect, ...props }, ref) => {
  // Calculate styles for origin-based animation
  // Combines transform-origin for zoom + CSS variables for slide direction
  const getOriginStyles = (): React.CSSProperties => {
    if (!originRect || typeof window === 'undefined') return {}

    // Get viewport dimensions
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Calculate center of clicked element
    const originCenterX = originRect.x + originRect.width / 2
    const originCenterY = originRect.y + originRect.height / 2

    // Viewport center is where the modal's center will be
    const viewportCenterX = vw / 2
    const viewportCenterY = vh / 2

    // Calculate offset from center in pixels
    const offsetX = originCenterX - viewportCenterX
    const offsetY = originCenterY - viewportCenterY

    // Scale down the slide distance (we don't want to slide the full distance)
    // This creates a subtle slide effect combined with the zoom
    const slideScale = 0.3
    const slideX = offsetX * slideScale
    const slideY = offsetY * slideScale

    return {
      transformOrigin: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
      '--slide-from-x': `${slideX}px`,
      '--slide-from-y': `${slideY}px`,
    } as React.CSSProperties
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogOriginContext.Provider value={originRect || null}>
        <DialogPrimitive.Content
          ref={ref}
          style={getOriginStyles()}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg gap-4 border bg-background p-4 sm:p-6 shadow-lg rounded-lg",
            originRect
              ? "duration-300 ease-out translate-x-[-50%] translate-y-[-50%] data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out"
              : "translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOriginContext.Provider>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
