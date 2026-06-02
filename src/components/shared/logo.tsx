"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "gradient" | "minimal";
  className?: string;
};

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex items-center gap-2 whitespace-nowrap transition-all duration-300",
        className,
      )}
    >
      {/* Hover glow effect */}
      <span className="absolute -inset-2 rounded-xl bg-primary/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

      <span
        className={cn(
          "relative font-display text-base font-black uppercase tracking-tight sm:text-lg",
          variant === "default" && "text-foreground",
          variant === "gradient" && "text-gradient-primary",
          variant === "minimal" && "text-foreground/80",
        )}
      >
        <span className="text-primary">Court</span>{" "}
        <span>Connect</span>
      </span>
    </Link>
  );
}
