"use client"
// components/ui/dialog.tsx
import React, { createContext, useContext, useState } from "react"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = (newState: boolean) => {
    if (!isControlled) {
      setInternalOpen(newState)
    }
    onOpenChange?.(newState)
  }

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactElement
}

export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within Dialog")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    context.onOpenChange(true)
  }

  if (asChild) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: (e: React.MouseEvent) => {
        handleClick(e)
        children.props.onClick?.(e)
      }
    })
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DialogContent({
  className = '',
  children,
  ...props
}: DialogContentProps) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within Dialog")

  if (!context.open) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => context.onOpenChange(false)}
      />
      <div
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}
        {...props}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          onClick={() => context.onOpenChange(false)}
        >
          ×
        </button>
      </div>
    </>
  )
}

export function DialogHeader({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
      {...props}
    />
  )
}

export function DialogTitle({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-lg font-semibold text-white ${className}`}
      {...props}
    />
  )
}