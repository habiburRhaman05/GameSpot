"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    // Reserve space — prevents layout shift while next-themes hydrates
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
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        "border border-border bg-surface/60 text-foreground/80",
        "backdrop-blur-md transition-all duration-200",
        "hover:border-border-strong hover:text-foreground hover:bg-surface",
        "focus-visible:outline-none",
        "active:scale-[0.95]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex"
          >
            <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex"
          >
            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
