"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "gradient" | "minimal";
  className?: string;
  hideTagline?: boolean;
};

export function Logo({
  variant = "default",
  className,
  hideTagline = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="GameSpot — home"
      className={cn(
        "group/logo relative inline-flex items-center gap-2.5 whitespace-nowrap outline-none",
        className,
      )}
    >
      {/* Soft athletic glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2.5 rounded-full bg-gradient-to-r from-primary/0 via-primary/30 to-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover/logo:opacity-100"
      />

      {/* Icon mark — refined, athletic */}
      <span
        className={cn(
          "relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
          "bg-[linear-gradient(135deg,var(--primary)_0%,color-mix(in_oklab,var(--primary)_70%,var(--accent))_100%)]",
          "shadow-[0_4px_14px_-4px_rgba(0,102,255,0.45),inset_0_1px_0_0_rgba(255,255,255,0.18)]",
          "transition-transform duration-300 group-hover/logo:scale-[1.04]",
        )}
      >
        {/* Highlight line */}
        <span
          aria-hidden
          className="absolute inset-x-1 top-0 h-px bg-white/50 mix-blend-overlay"
        />
        {/* Glyph */}
        <span className="relative font-display text-[14px] font-black leading-none text-white drop-shadow-sm">
          G
        </span>
        {/* Live dot */}
        <span
          aria-hidden
          className="absolute right-1 top-1 inline-flex h-1.5 w-1.5 items-center justify-center"
        >
          <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-accent/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
        </span>
      </span>

      {/* Wordmark */}
      <span className="relative flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-black uppercase leading-none tracking-tight sm:text-base",
            variant === "default" && "text-foreground",
            variant === "gradient" && "text-gradient-aurora",
            variant === "minimal" && "text-foreground/80",
          )}
        >
          <span className="text-primary">Game</span>
          <span>Spot</span>
        </span>
        {!hideTagline && (
          <span className="mt-1 text-[7.5px] font-bold uppercase tracking-[0.24em] text-text-tertiary sm:text-[8px]">
            Elite Sports Network
          </span>
        )}
      </span>
    </Link>
  );
}
