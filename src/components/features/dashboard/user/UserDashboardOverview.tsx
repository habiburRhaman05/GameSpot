"use client";

import { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, CircleDollarSign, Clock3, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { BookingService } from "@/service/booking.service";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

const UserDashboardCharts = dynamic(
  () => import("./UserDashboardCharts").then((mod) => mod.UserDashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="h-84 skeleton rounded-xl" />
        <div className="h-84 skeleton rounded-xl" />
      </div>
    ),
  },
);

const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;

const getVenueName = (booking: { court?: { name?: string | null }; courtId: string }) => {
  const name = booking.court?.name?.trim();
  return name && name.length > 0 ? name : `Court ${booking.courtId.slice(0, 6)}`;
};

const getVenueImage = (booking: { court?: { media?: { url: string; isPrimary?: boolean }[] } }) => {
  const primaryMedia = booking.court?.media?.find((media) => media.isPrimary);
  return primaryMedia?.url ?? booking.court?.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE;
};

const statusVariant = (status: string) => {
  if (status === "PAID" || status === "COMPLETED") return "success";
  if (status === "PENDING") return "warning";
  if (status === "CANCELLED") return "error";
  return "default";
};

export default function UserDashboardOverview() {
  const bookingsQuery = useQuery({
    queryKey: ["user-dashboard-bookings"],
    queryFn: () => BookingService.getUserBookings({ limit: 100 }),
    staleTime: 30_000,
  });

  const bookings = useMemo(() => bookingsQuery.data?.data ?? [], [bookingsQuery.data?.data]);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "PAID",
  ).length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalSpent = useMemo(
    () =>
      bookings.reduce((sum, b) => {
        if (b.status === "PAID" || b.status === "COMPLETED") return sum + Number(b.totalAmount || 0);
        return sum;
      }, 0),
    [bookings],
  );
  const completionPercent = totalBookings === 0 ? 0 : Math.round((completedBookings / totalBookings) * 100);

  const trendData = useMemo(() => {
    const monthMap = new Map<string, number>();
    for (const b of bookings) {
      const monthLabel = new Date(b.bookingDate).toLocaleString("en-US", { month: "short" });
      monthMap.set(monthLabel, (monthMap.get(monthLabel) ?? 0) + 1);
    }
    return Array.from(monthMap.entries()).map(([month, count]) => ({ month, bookings: count }));
  }, [bookings]);

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 5),
    [bookings],
  );

  if (bookingsQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          My Dashboard
        </h1>
        <p className="text-sm text-text-tertiary">
          Personal booking insights and real-time activity snapshots.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <DashboardStatCard
          label="Total Bookings"
          value={totalBookings}
          icon={CalendarCheck2}
          subtitle="All-time booking count"
          sparklineData={trendData.map((d) => ({ value: d.bookings }))}
        />
        <DashboardStatCard
          label="Active"
          value={activeBookings}
          icon={Clock3}
          subtitle="Pending & paid reservations"
        />
        <DashboardStatCard
          label="Completed"
          value={completedBookings}
          icon={Trophy}
          subtitle={`${completionPercent}% completion rate`}
          trend={totalBookings > 0 ? { direction: "up", percent: completionPercent } : undefined}
        />
        <DashboardStatCard
          label="Total Spent"
          value={totalSpent}
          icon={CircleDollarSign}
          subtitle="From paid & completed bookings"
          accent
        />
      </div>

      <UserDashboardCharts
        trendData={trendData}
        completionPercent={completionPercent}
      />

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-text-tertiary py-8">
                      No recent bookings found.
                    </TableCell>
                  </TableRow>
                )}
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border/60">
                          <Image
                            src={getVenueImage(booking)}
                            alt={getVenueName(booking)}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <span className="font-medium text-foreground">{getVenueName(booking)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-tertiary">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(booking.status) as any}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell className={cn("text-right font-medium text-foreground")}>
                      {formatMoney(Number(booking.totalAmount || 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
