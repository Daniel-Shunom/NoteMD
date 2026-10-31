"use client"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Camera } from "lucide-react"

// Define status colors
const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
} as const

type StatusType = keyof typeof statusColors

interface ExtendedAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  status?: StatusType
  showStatusBadge?: boolean
  bordered?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  ExtendedAvatarProps
>(({ 
  className, 
  status, 
  showStatusBadge = false, 
  bordered = false,
  hoverable = false,
  size = "md",
  interactive = false,
  ...props 
}, ref) => (
  <div className="relative inline-block group">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        bordered && "ring-2 ring-white shadow-lg",
        hoverable && "transition-transform duration-200 ease-in-out group-hover:scale-105",
        interactive && "cursor-pointer",
        className
      )}
      {...props}
    />
    
    {/* Status Badge */}
    {showStatusBadge && status && (
      <span className={cn(
        "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
        status === 'online' && "animate-pulse",
        statusColors[status],
        size === 'sm' && "h-2 w-2",
        size === 'md' && "h-3 w-3",
        size === 'lg' && "h-4 w-4",
        size === 'xl' && "h-5 w-5",
      )} />
    )}

    {/* Interactive Overlay */}
    {interactive && (
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          <Camera className="h-5 w-5 text-white" />
        </div>
      </div>
    )}
  </div>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover transition-opacity duration-200",
      className
    )}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted/10 backdrop-blur-sm",
      "text-muted-foreground font-medium",
      "animate-in fade-in duration-200",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }