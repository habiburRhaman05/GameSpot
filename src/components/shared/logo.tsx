"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
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
  const iconRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!iconRef.current || !glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(iconRef.current, {
        boxShadow:
          "0 0 16px rgba(124,106,239,0.35), 0 0 32px rgba(124,106,239,0.1)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glowRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex items-center gap-2.5 whitespace-nowrap transition-all duration-200",
        className,
      )}
    >
      {/* Animated glow background */}
      <span
        ref={glowRef}
        className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/15 via-accent/8 to-primary/15 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Icon mark — smaller, refined */}
      <span
        ref={iconRef}
        className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm sm:h-8 sm:w-8"
      >
        <span className="text-[9px] font-black text-white sm:text-[10px]">
          G
        </span>
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
      </span>

      {/* Text */}
      <span className="relative flex flex-col">
        <span
          className={cn(
            "font-display text-sm font-black uppercase tracking-tight leading-none sm:text-base",
            variant === "default" && "text-foreground",
            variant === "gradient" && "text-gradient-primary",
            variant === "minimal" && "text-foreground/80",
          )}
        >
          <span className="text-primary">Game</span>
          <span>Spot</span>
        </span>
        {!hideTagline && (
          <span className="text-[7px] font-bold uppercase tracking-[0.22em] text-text-tertiary sm:text-[8px]">
            Elite Sports Network
          </span>
        )}
      </span>
    </Link>
  );
}
