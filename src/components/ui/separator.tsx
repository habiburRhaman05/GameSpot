"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  variant?: "default" | "gradient"
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      data-variant={variant}
      className={cn(
        "shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        variant === "default" && "bg-border",
        variant === "gradient" && "bg-gradient-to-r from-transparent via-border to-transparent data-vertical:bg-gradient-to-b",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
