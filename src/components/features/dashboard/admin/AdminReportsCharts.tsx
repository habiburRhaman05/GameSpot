"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type StatusKey = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED";

type AdminReportsChartsProps = {
  monthlyRevenue: Array<{ monthKey: string; monthLabel: string; revenue: number }>;
  statusBreakdown: Array<{ status: StatusKey; count: number }>;
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const bookingStatusChartConfig = {
  PENDING: { label: "Pending", color: "var(--color-warning)" },
  PAID: { label: "Paid", color: "var(--color-primary)" },
  COMPLETED: { label: "Completed", color: "var(--color-success)" },
  CANCELLED: { label: "Cancelled", color: "var(--color-error)" },
} satisfies ChartConfig;

export function AdminReportsCharts({
  monthlyRevenue,
  statusBreakdown,
}: AdminReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-70 w-full">
            <BarChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {monthlyRevenue.map((row) => (
                  <Cell key={row.monthKey} fill="url(#revenueGrad)" />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Booking Status Mix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={bookingStatusChartConfig}
            className="mx-auto h-56 w-full max-w-72"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="status"
                innerRadius={55}
                outerRadius={86}
                strokeWidth={4}
                stroke="var(--color-card)"
              >
                {statusBreakdown.map((row) => {
                  const colorMap: Record<string, string> = {
                    PENDING: "var(--color-warning)",
                    PAID: "var(--color-primary)",
                    COMPLETED: "var(--color-success)",
                    CANCELLED: "var(--color-error)",
                  };
                  return <Cell key={row.status} fill={colorMap[row.status] ?? "var(--color-border)"} />;
                })}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="space-y-2">
            {statusBreakdown.map((row) => (
              <div key={row.status} className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{row.status}</span>
                <span className="text-text-tertiary">{row.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
