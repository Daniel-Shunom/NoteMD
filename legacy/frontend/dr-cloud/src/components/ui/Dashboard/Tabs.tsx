"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react" // For mobile indicator

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Base styles
      "inline-flex items-center justify-center rounded-3xl",
      "backdrop-blur-xl backdrop-filter bg-gray-900/40",
      "shadow-xl border border-gray-700/20",
      "dark:bg-gray-800/40 dark:border-gray-600/20",
      
      // Mobile styles
      "w-full flex-col h-auto p-1.5 gap-1",
      "sm:h-14 sm:flex-row sm:gap-1 sm:p-1.5",
      "lg:h-16 lg:p-2",
      
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styles
      "inline-flex items-center justify-center whitespace-nowrap rounded-2xl",
      "text-base font-medium text-gray-400 transition-all duration-300 ease-out select-none",
      "hover:bg-gray-800/50 hover:text-gray-100",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-lg",
      "relative overflow-hidden group",

      // Mobile styles
      "w-full px-4 py-2.5 text-sm",
      "sm:w-auto sm:px-6 sm:py-2.5 sm:text-base",
      "lg:px-8 lg:py-3",
      
      className
    )}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2 justify-center">
      {props.children}
    </span>
    <div 
      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 
                 transition-opacity duration-500 ease-out group-data-[state=active]:opacity-100
                 group-hover:opacity-50" 
    />
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AnimatePresence mode="wait">
    <TabsPrimitive.Content
      ref={ref}
      {...props}
      asChild
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={cn(
          // Base styles
          "rounded-3xl",
          "backdrop-blur-xl backdrop-filter bg-gray-900/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2",
          "shadow-2xl border border-gray-700/20",
          "dark:bg-gray-800/40 dark:border-gray-600/20",
          
          // Mobile margins and padding
          "mt-4 p-1",
          "sm:mt-6 sm:p-1",
          "lg:mt-8 lg:p-1",
          
          className
        )}
      >
        <div className="rounded-2xl overflow-hidden">
          {props.children}
        </div>
      </motion.div>
    </TabsPrimitive.Content>
  </AnimatePresence>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }