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
    className={`flex w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1 ${className}`}
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
      flex-1 px-5 py-3 text-sm font-medium text-white capitalize
      transition-all duration-200 ease-out
      rounded-md
      hover:bg-white/15
      focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
      data-[state=active]:bg-white/20 
      data-[state=active]:backdrop-blur-sm 
      data-[state=active]:text-white 
      data-[state=active]:font-semibold
      data-[state=active]:shadow-inner
      data-[state=active]:border-b-2 
      data-[state=active]:border-white
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