"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { cn } from "@/lib/utils";

type TrendDirection = "up" | "down" | "neutral";

type DashboardStatCardProps = {
  label: string;
  value: number;
  icon?: LucideIcon;
  accent?: boolean;
  subtitle?: string;
  trend?: { direction: TrendDirection; percent: number };
  sparklineData?: { value: number }[];
  className?: string;
};

const sparklineConfig = {
  value: { label: "Value", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  accent,
  subtitle,
  trend,
  sparklineData,
  className,
}: DashboardStatCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    trend?.direction === "up"
      ? "text-emerald-500"
      : trend?.direction === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  const data = sparklineData ?? [];

  return (
    <Card
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong",
        accent ? "bg-gradient-to-br from-primary/5 via-card to-accent/5" : "bg-card",
        className,
      )}
    >
      {/* Sparkline background */}
      {data.length > 1 && (
        <div className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-48 opacity-[0.08] dark:opacity-[0.12]">
          <ChartContainer config={sparklineConfig} className="h-full w-full">
            <AreaChart data={data}>
              <Area
                dataKey="value"
                type="monotone"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={1}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

      <CardContent className="relative z-10 flex h-full flex-col gap-3 p-5">
        {/* Icon + Label row */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
            {label}
          </p>
          {Icon && (
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border",
                accent
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-primary/20 bg-primary/10 text-primary",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
          )}
        </div>

        {/* Value with AnimatedCounter */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
            <AnimatedCounter value={value} duration={1.2} />
          </span>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[11px] font-medium",
                trendColor,
              )}
            >
              <TrendIcon className="h-3 w-3" strokeWidth={2.5} />
              {trend.percent}%
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-text-tertiary">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
