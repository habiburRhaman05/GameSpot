"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Building2, Timer, Activity, CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { organizerService } from "@/service/organizer.service";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";

const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function OrganizerAnalyticsPage() {
  const revenueBreakdownQuery = useQuery({
    queryKey: ["organizer-revenue-breakdown", 90],
    queryFn: () => organizerService.getRevenueBreakdown({ days: 90 }),
    staleTime: 60_000,
  });

  const revenueBreakdown = revenueBreakdownQuery.data?.data;
  const topVenue = revenueBreakdown?.venueBreakdown?.[0] ?? null;

  const underperformingWindow = useMemo(() => {
    const rows = (revenueBreakdown?.slotWindowBreakdown ?? []).filter((w) => w.slotCount > 0);
    if (rows.length === 0) return null;
    return [...rows].sort((a, b) => a.revenue - b.revenue)[0];
  }, [revenueBreakdown?.slotWindowBreakdown]);

  const dayBreakdown = useMemo(() => {
    const rows = revenueBreakdown?.dayOfWeekBreakdown ?? [];
    return [...rows].sort(
      (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
    );
  }, [revenueBreakdown?.dayOfWeekBreakdown]);

  const heatmapRows = revenueBreakdown?.heatmap ?? [];
  const slotWindows = revenueBreakdown?.slotWindowBreakdown ?? [];
  const maxHeatRevenue = Math.max(1, ...heatmapRows.map((c) => Number(c.revenue ?? 0)));

  const getHeatCell = (dayOfWeek: number, windowKey: string) =>
    heatmapRows.find((c) => c.dayOfWeek === dayOfWeek && c.windowKey === windowKey) ?? null;

  if (revenueBreakdownQuery.isPending) return <DashboardSkeleton />;

  return (
    <DashboardErrorBoundary fallbackTitle="Analytics Error" fallbackMessage="Failed to load analytics data. Please try again.">
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
              <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
              Live
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Analytics
            </h1>
          </div>
          <p className="text-sm text-text-secondary">
            Revenue breakdown by venue, day-of-week, and slot windows.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total Revenue"
          value={revenueBreakdown?.summary.totalRevenue ?? 0}
          icon={CircleDollarSign}
          subtitle={`Last ${revenueBreakdown?.rangeDays ?? 90} days`}
          accent
        />
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Top Revenue Venue
            </p>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground line-clamp-1">
              {topVenue?.courtName ?? "No data"}
            </p>
            {topVenue && (
              <p className="mt-1 text-xs text-text-tertiary">
                {formatMoney(topVenue.revenue)} · {topVenue.bookings} bookings
              </p>
            )}
          </div>
          {!topVenue && <p className="text-xs text-text-tertiary">No paid booking revenue found</p>}
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Underperforming Window
            </p>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Timer className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {underperformingWindow?.label ?? "No data"}
            </p>
            {underperformingWindow && (
              <p className="mt-1 text-xs text-text-tertiary">
                {formatMoney(underperformingWindow.revenue)} · {underperformingWindow.slotCount} slots
              </p>
            )}
          </div>
          {!underperformingWindow && <p className="text-xs text-text-tertiary">No slot data available</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-label text-base font-semibold text-foreground">
              Revenue Heatmap (Day × Slot)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <div className="min-w-[640px] space-y-2">
                <div className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] gap-2">
                  <div />
                  {slotWindows.map((w) => (
                    <p key={w.windowKey} className="text-center text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                      {w.label}
                    </p>
                  ))}
                </div>

                {dayBreakdown.map((day) => (
                  <div key={day.dayOfWeek} className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] items-center gap-2">
                    <p className="text-xs font-medium text-foreground">{day.label}</p>
                    {slotWindows.map((w) => {
                      const cell = getHeatCell(day.dayOfWeek, w.windowKey);
                      const ratio = Number(cell?.revenue ?? 0) / maxHeatRevenue;
                      const opacity = Math.max(0.08, Math.min(1, ratio));

                      return (
                        <div
                          key={`${day.dayOfWeek}-${w.windowKey}`}
                          className="rounded-lg border border-border px-2 py-2 text-center transition-all"
                          style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) ${opacity * 100}%, transparent)` }}
                          title={`${day.label} ${w.label}: ${formatMoney(Number(cell?.revenue ?? 0))}`}
                        >
                          <p className="font-mono text-[11px] font-semibold text-foreground">
                            {formatMoney(Number(cell?.revenue ?? 0))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-label text-base font-semibold text-foreground">
                Revenue by Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(revenueBreakdown?.venueBreakdown ?? []).slice(0, 8).map((venue) => (
                <div key={venue.courtId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-medium text-foreground">{venue.courtName}</p>
                    <p className="text-text-tertiary">{formatMoney(venue.revenue)}</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.min(100, venue.sharePercent)}%` }}
                    />
                  </div>
                </div>
              ))}
              {(revenueBreakdown?.venueBreakdown?.length ?? 0) === 0 && (
                <p className="text-xs text-text-tertiary">No paid booking revenue found in this period.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-label text-base font-semibold text-foreground">
                Revenue by Day of Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dayBreakdown.map((day) => (
                <div key={day.dayOfWeek} className="flex items-center justify-between py-1.5 text-xs">
                  <span className="font-medium text-foreground">{day.label}</span>
                  <span className="text-text-tertiary">{formatMoney(day.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardErrorBoundary>
  );
}
