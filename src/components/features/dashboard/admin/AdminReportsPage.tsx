"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BadgeCheck, BarChart3, CircleDollarSign, Layers } from "lucide-react";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminService } from "@/service/admin.service";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

const money = (value: number) => `USD ${value.toFixed(2)}`;

const AdminReportsCharts = dynamic(
  () => import("./AdminReportsCharts").then((mod) => mod.AdminReportsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="h-96 skeleton rounded-xl" />
        <div className="h-96 skeleton rounded-xl" />
      </div>
    ),
  },
);

const rangeOptions = [
  { label: "90D", value: 90 },
  { label: "180D", value: 180 },
  { label: "365D", value: 365 },
] as const;

const severityToVariant = (severity: "LOW" | "MEDIUM" | "HIGH") => {
  if (severity === "HIGH") return "destructive" as const;
  if (severity === "MEDIUM") return "default" as const;
  return "outline" as const;
};

export default function AdminReportsPage() {
  const [rangeDays, setRangeDays] = useState<number>(180);

  const reportsQuery = useQuery({
    queryKey: ["admin-reports", rangeDays],
    queryFn: () => adminService.getReports({ days: rangeDays }),
    staleTime: 60_000,
  });

  const report = reportsQuery.data?.data;
  const totalAlertItems = useMemo(
    () => report?.alerts.reduce((sum, alert) => sum + alert.value, 0) ?? 0,
    [report?.alerts],
  );
  const topCourtType = report?.courtTypePerformance[0] ?? null;

  if (reportsQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Reports Intelligence
          </h1>
          <p className="text-sm text-text-tertiary">
            Decision-grade analytics across revenue, operations, and organizer performance.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5">
          {rangeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={rangeDays === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setRangeDays(option.value)}
              className="px-3"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Lifetime Revenue"
          value={report?.summary.lifetimeRevenue ?? 0}
          icon={CircleDollarSign}
          subtitle="Paid + completed bookings"
          accent
        />
        <DashboardStatCard
          label="Completed Transactions"
          value={report?.summary.completedTransactions ?? 0}
          icon={BadgeCheck}
          subtitle={`Total bookings: ${report?.summary.totalBookings ?? 0}`}
        />
        <DashboardStatCard
          label="Active Organizers"
          value={report?.summary.activeOrganizersInRange ?? 0}
          icon={BarChart3}
          subtitle={`Window: ${report?.rangeDays ?? rangeDays} days`}
        />
        <DashboardStatCard
          label="Operational Alerts"
          value={totalAlertItems}
          icon={AlertTriangle}
          subtitle="Pending approvals + expiring coupons"
        />
      </div>

      <AdminReportsCharts
        monthlyRevenue={report?.monthlyRevenue ?? []}
        statusBreakdown={report?.statusBreakdown ?? []}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-label text-base font-semibold text-foreground">
              Top Organizers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[620px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Courts</TableHead>
                    <TableHead>Paid Bookings</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(report?.topOrganizers.length ?? 0) === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-text-tertiary py-8">
                        No organizer revenue activity found for this range.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (report?.topOrganizers ?? []).map((organizer) => (
                      <TableRow key={organizer.organizerId}>
                        <TableCell className="font-medium text-foreground">{organizer.businessName}</TableCell>
                        <TableCell className="text-text-tertiary">{organizer.ownerName}</TableCell>
                        <TableCell className="text-text-tertiary">{organizer.courtCount}</TableCell>
                        <TableCell className="text-text-tertiary">{organizer.paidBookings}</TableCell>
                        <TableCell className="text-right font-medium text-foreground">{money(organizer.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-label text-base font-semibold text-foreground">
                Court Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(report?.courtTypePerformance ?? []).map((row) => {
                const maxRevenue = report?.courtTypePerformance[0]?.revenue ?? 1;
                const width = Math.max(6, Math.min(100, (row.revenue / maxRevenue) * 100));
                return (
                  <div key={row.courtType} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <p className="font-medium text-foreground">{row.courtType}</p>
                      <p className="text-text-tertiary">{money(row.revenue)}</p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${width}%` }} />
                    </div>
                    <p className="text-[11px] text-text-tertiary">{row.paidBookings} paid bookings</p>
                  </div>
                );
              })}
              {!report?.courtTypePerformance?.length && (
                <p className="text-xs text-text-tertiary">No court type revenue data available.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-label text-base font-semibold text-foreground">
                Operational Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(report?.alerts ?? []).map((alert) => (
                <div key={alert.key} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
                  <p className="text-xs text-foreground">{alert.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{alert.value}</span>
                    <Badge variant={severityToVariant(alert.severity) as any}>{alert.severity}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-label text-base font-semibold text-foreground">
                Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-text-tertiary">Top court type in selected range:</p>
              <p className="font-display text-xl font-semibold tracking-tight text-foreground">
                {topCourtType?.courtType ?? "No Data"}
              </p>
              {topCourtType && (
                <p className="text-text-tertiary">
                  {money(topCourtType.revenue)} from {topCourtType.paidBookings} paid bookings.
                </p>
              )}
              <div className="inline-flex items-center gap-1 text-[11px] text-text-tertiary">
                <Layers className="size-3.5" />
                Generated {report ? new Date(report.generatedAt).toLocaleString() : "-"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {reportsQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          Failed to load reports data.
        </div>
      )}
    </div>
  );
}
