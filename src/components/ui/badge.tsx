import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent",
        accent: "bg-accent text-accent-foreground border-transparent",
        success:
          "bg-success/15 text-success border-success/20",
        warning:
          "bg-warning/15 text-warning border-warning/20",
        error:
          "bg-error/15 text-error border-error/20",
        info: "bg-info/15 text-info border-info/20",
        live: "bg-success/15 text-success border-success/20 before:mr-1 before:size-1.5 before:rounded-full before:bg-success before:animate-pulse-soft",
        premium:
          "bg-tertiary/15 text-tertiary border-tertiary/20",
        trending:
          "bg-primary/15 text-primary border-primary/20",
        outline:
          "border-border bg-transparent text-foreground",
        ghost:
          "bg-transparent border-transparent text-foreground hover:bg-surface-2",
        dot: "bg-transparent border-transparent text-foreground pl-4 relative before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:size-1.5 before:rounded-full before:bg-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
