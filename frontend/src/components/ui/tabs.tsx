"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`flex w-full bg-gray-200 rounded-lg p-1 ${className}`}
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
    className={`
      flex-1 px-5 py-4 text-lg font-semibold text-gray-700 capitalize
      transition-all duration-200 ease-out
      rounded-md
      hover:bg-gray-100 hover:text-gray-900
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
      data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg
      data-[state=active]:translate-y-[-4px] data-[state=active]:border data-[state=active]:border-black
      ${className}
    `}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`mt-4 focus:outline-none ${className}`}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }