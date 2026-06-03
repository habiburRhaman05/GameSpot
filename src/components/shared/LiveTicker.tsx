"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Mock live tickers — display-only, no business logic
   ========================================================================== */
type TickerItem = {
  id: string;
  sport: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  status: "LIVE" | "FT" | "HT";
};

const initialItems: TickerItem[] = [
  { id: "1", sport: "BBALL", home: "Lions", away: "Tigers", homeScore: 86, awayScore: 79, status: "LIVE" },
  { id: "2", sport: "FUTSAL", home: "Strikers", away: "United", homeScore: 3, awayScore: 2, status: "LIVE" },
  { id: "3", sport: "TENNIS", home: "Khan", away: "Rivera", homeScore: 6, awayScore: 4, status: "LIVE" },
  { id: "4", sport: "BBALL", home: "Hawks", away: "Wolves", homeScore: 102, awayScore: 98, status: "FT" },
  { id: "5", sport: "BADMTN", home: "Park", away: "Liu", homeScore: 21, awayScore: 18, status: "LIVE" },
  { id: "6", sport: "CRICKET", home: "Royals", away: "Kings", homeScore: 187, awayScore: 142, status: "HT" },
];

function TickerCell({ item }: { item: TickerItem }) {
  const isLive = item.status === "LIVE";
  return (
    <span className="group/tk inline-flex items-center gap-2 px-4 py-1.5 text-[10.5px] font-semibold whitespace-nowrap">
      <span
        className={cn(
          "inline-flex h-1.5 w-1.5 rounded-full shrink-0",
          isLive
            ? "bg-accent shadow-[0_0_6px_var(--accent)] animate-pulse-soft"
            : "bg-text-tertiary/60",
        )}
      />
      <span className="font-bold uppercase tracking-[0.14em] text-text-tertiary">
        {item.sport}
      </span>
      <span className="text-foreground/85">
        {item.home}{" "}
        <span className="font-display font-black text-foreground">
          {item.homeScore}
        </span>
        <span className="mx-1.5 text-text-tertiary/60">·</span>
        <span className="font-display font-black text-foreground">
          {item.awayScore}
        </span>{" "}
        {item.away}
      </span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.16em]",
          isLive
            ? "bg-accent/15 text-accent"
            : "bg-surface-2 text-text-tertiary",
        )}
      >
        {item.status}
      </span>
    </span>
  );
}

export function LiveTicker({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  // Slowly mutate live scores for ambient sports-feel (no API)
  useEffect(() => {
    const id = setInterval(() => {
      // Trigger re-render via state nudge on the DOM (cheap)
      // Real implementation would tick scores; we keep mock static
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // Duplicate items for seamless marquee
  const stream = [...initialItems, ...initialItems];

  return (
    <div
      className={cn(
        "group/ticker relative overflow-hidden border-b border-border/60 bg-surface/40 backdrop-blur-md",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Live scores ticker"
    >
      {/* Edge fades — theme-aware */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface/90 to-transparent dark:from-background/90" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface/90 to-transparent dark:from-background/90" />

      <div className="relative flex h-7 items-center">
        {/* LIVE label pill */}
        <div className="sticky left-0 z-20 flex h-full shrink-0 items-center gap-1.5 border-r border-border/60 bg-background/85 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
          <Activity className="h-3 w-3" strokeWidth={2.4} />
          <span>Live</span>
        </div>

        {/* Marquee track */}
        <div className="relative flex flex-1 overflow-hidden">
          <div
            className={cn(
              "flex shrink-0 animate-marquee items-center will-change-transform",
              paused && "[animation-play-state:paused]",
            )}
            style={{ animationDuration: "60s" }}
          >
            {stream.map((item, i) => (
              <span key={`${item.id}-${i}`} className="flex items-center">
                <TickerCell item={item} />
                <span className="h-3 w-px bg-border/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
