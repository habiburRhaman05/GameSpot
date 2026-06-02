"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type AdminDashboardChartsProps = {
  monthlyRegistrations: Array<{ month: string; registrations: number }>;
  approvalPercent: number;
};

const registrationChartConfig = {
  registrations: {
    label: "Registrations",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  approved: {
    label: "Approved",
    color: "var(--color-primary)",
  },
  pending: {
    label: "Pending",
    color: "var(--color-border)",
  },
} satisfies ChartConfig;

export function AdminDashboardCharts({
  monthlyRegistrations,
  approvalPercent,
}: AdminDashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Monthly Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={registrationChartConfig} className="h-60 w-full">
            <BarChart data={monthlyRegistrations}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="registrations" radius={[6, 6, 0, 0]}>
                {monthlyRegistrations.map((item, index) => (
                  <Cell key={`${item.month}-${index}`} fill="var(--color-registrations)" />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Organizer Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChartContainer config={donutChartConfig} className="mx-auto h-55 w-full max-w-60">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={[
                  { key: "approved", value: approvalPercent, fill: "var(--color-approved)" },
                  { key: "pending", value: Math.max(0, 100 - approvalPercent), fill: "var(--color-pending)" },
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
            {approvalPercent}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
