"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /** Visual size of the button square in px (default 40) */
  size?: number;
};

export function ThemeToggle({ className, size = 40 }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn("inline-block rounded-full", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "group/theme relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border border-border bg-surface/60 text-foreground/85 backdrop-blur-md",
        "transition-all duration-200",
        "hover:border-primary/40 hover:text-foreground hover:bg-surface hover:shadow-[0_0_0_3px_var(--primary-soft)]",
        "focus-visible:outline-none",
        "active:scale-[0.94]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Soft halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover/theme:from-primary/10 group-hover/theme:to-accent/10 group-hover/theme:opacity-100"
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex"
          >
            <Moon
              className="h-[18px] w-[18px] text-primary"
              strokeWidth={2}
            />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -60, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex"
          >
            <Sun
              className="h-[18px] w-[18px] text-tertiary"
              strokeWidth={2}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
