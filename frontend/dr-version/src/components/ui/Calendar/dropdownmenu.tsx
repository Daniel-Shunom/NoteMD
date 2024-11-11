// components/ui/dropdown-menu.tsx
import React, { createContext, useContext, useRef, useEffect, useState } from 'react'

interface DropdownContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DropdownContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactElement
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    context.onOpenChange(!context.open)
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

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DropdownMenuContent({
  className = '',
  children,
  ...props
}: DropdownMenuContentProps) {
  const context = useContext(DropdownContext)
  const ref = useRef<HTMLDivElement>(null)
  
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.onOpenChange(false)
      }
    }

    if (context.open) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [context.open])

  if (!context.open) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white/10 backdrop-blur-xl p-1 shadow-md ${className}`}
      {...props}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuItem must be used within DropdownMenu")

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-white/20 hover:bg-white/20 ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        context.onOpenChange(false)
        props.onClick?.(e)
      }}
      {...props}
    >
      {children}
    </div>
  )
}