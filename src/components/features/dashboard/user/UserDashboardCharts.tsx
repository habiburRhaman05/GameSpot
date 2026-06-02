"use client";

import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type UserDashboardChartsProps = {
  trendData: Array<{ month: string; bookings: number }>;
  completionPercent: number;
};

const trendChartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  used: {
    label: "Completion",
    color: "var(--color-primary)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--color-border)",
  },
} satisfies ChartConfig;

export function UserDashboardCharts({
  trendData,
  completionPercent,
}: UserDashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Booking Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendChartConfig} className="h-60 w-full">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="bookings"
                type="monotone"
                stroke="var(--color-primary)"
                fill="url(#bookingGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer
            config={donutChartConfig}
            className="mx-auto h-55 w-full max-w-60"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={[
                  { key: "used", value: completionPercent, fill: "var(--color-used)" },
                  { key: "remaining", value: Math.max(0, 100 - completionPercent), fill: "var(--color-remaining)" },
                ]}
                dataKey="value"
                nameKey="key"
                innerRadius={58}
                outerRadius={86}
                strokeWidth={4}
                stroke="var(--color-card)"
              />
            </PieChart>
          </ChartContainer>
          <p className="text-center font-display text-3xl font-semibold tracking-tight text-foreground">
            {completionPercent}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
