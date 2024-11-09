// /ui/select.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, className, ...props }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200" htmlFor={props.id}>
        {label}
      </label>
      <select
        className={cn(
          "block w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
