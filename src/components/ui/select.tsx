import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  /** Compact size variant */
  variant?: "default" | "sm";
};

function Select({
  className,
  variant = "default",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "w-full min-w-0 appearance-none rounded-lg border border-border bg-surface/50 text-sm transition-all duration-200 outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variant === "sm" ? "h-9 px-3 py-1 pr-9" : "h-11 px-3 py-1.5 pr-9",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {/* Dropdown chevron */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </span>
    </div>
  );
}

export { Select };
