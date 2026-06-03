import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover",
        action:
          "bg-action text-white shadow-sm hover:bg-action-hover",
        outline:
          "border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-border-strong",
        ghost:
          "bg-transparent text-foreground hover:bg-surface-2",
        glass:
          "glass text-foreground hover:bg-surface-2 hover:border-border-strong",
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        glow:
          "bg-primary text-primary-foreground shadow-glow-primary hover:shadow-glow-primary/80 hover:shadow-lg",
      },
      size: {
        sm: "h-9 gap-1.5 px-3 text-xs/relaxed [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 gap-2 px-4 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 gap-2 px-5 [&_svg:not([class*='size-'])]:size-4",
        xl: "h-12 gap-2.5 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
