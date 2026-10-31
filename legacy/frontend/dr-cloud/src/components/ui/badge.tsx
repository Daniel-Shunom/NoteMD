"use client"
import React from 'react';
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white";
    
    const variants = {
      default: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
      secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
      destructive: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500",
      outline: "border border-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500",
      success: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500"
    };

    const sizes = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-1",
      lg: "text-base px-3 py-1.5"
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;