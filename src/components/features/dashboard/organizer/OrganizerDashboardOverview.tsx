"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Clock3, ShieldAlert, Trophy, ArrowRight } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import { VENUE_FALLBACK_IMAGE, AVATAR_FALLBACK_IMAGE, getInitials } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

const OrganizerDashboardCharts = dynamic(
  () => import("./OrganizerDashboardCharts").then((mod) => mod.OrganizerDashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="h-80 skeleton rounded-xl" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    ),
  },
);

const formatMoney = (value: number) => `USD ${value.toFixed(2)}`;

export default function OrganizerDashboardOverview() {
  const courtsQuery = useQuery({
    queryKey: ["organizer-dashboard-courts"],
    queryFn: () => courtService.getOrganizerCourts({ limit: 100 }),
    staleTime: 30_000,
  });

  const courts = useMemo(() => courtsQuery.data?.data ?? [], [courtsQuery.data?.data]);

  const bookingsQuery = useQuery({
    queryKey: ["organizer-dashboard-bookings", courts.map((c) => c.id).join("|")],
    enabled: courts.length > 0,
    queryFn: async () => {
      const responses = await Promise.all(
        courts.slice(0, 6).map((court) => BookingService.getCourtBookings(court.id, { limit: 20 })),
      );
      return responses.flatMap((r) => r.data ?? []);
    },
    staleTime: 20_000,
  });

  const bookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data]);
  const courtLookup = useMemo(() => new Map(courts.map((c) => [c.id, c])), [courts]);

  const totalEarnings = bookings.reduce((sum, b) => {
    if (b.status === "PAID" || b.status === "COMPLETED") return sum + Number(b.totalAmount || 0);
    return sum;
  }, 0);
  const activeBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "PAID").length;
  const pendingVerifications = courts.filter((c) => c.status === "PENDING_APPROVAL").length;
  const totalVenueBookings = courts.reduce((sum, c) => sum + (c._count?.bookings ?? 0), 0);
  const occupancyPercent = courts.length === 0 ? 0 : Math.min(100, Math.round((totalVenueBookings / courts.length) * 8));

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
        .slice(0, 6),
    [bookings],
  );

  const topCourt = useMemo(() => {
    if (courts.length === 0) return null;
    const sorted = [...courts].sort((a, b) => (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0));
    if ((sorted[0]?._count?.bookings ?? 0) === 0) return null;
    return sorted[0];
  }, [courts]);

  const getVenueName = (booking: (typeof bookings)[number]) => {
    const n = booking.court?.name?.trim();
    if (n) return n;
    const fc = courtLookup.get(booking.courtId);
    const fn = fc?.name?.trim();
    return fn || `Court ${booking.courtId.slice(0, 6)}`;
  };

  const getVenueImage = (booking: (typeof bookings)[number]) => {
    const pm = booking.court?.media?.find((m) => m.isPrimary);
    if (pm?.url) return pm.url;
    if (booking.court?.media?.[0]?.url) return booking.court.media[0].url;
    const fc = courtLookup.get(booking.courtId);
    return fc?.media?.find((m) => m.isPrimary)?.url ?? fc?.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE;
  };

  if (courtsQuery.isPending || (courts.length > 0 && bookingsQuery.isPending)) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Studio Overview
        </h1>
        <p className="text-sm text-text-tertiary">
          Performance insights and real-time operations for your venues.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <DashboardStatCard
          label="Total Earnings"
          value={totalEarnings}
          icon={CircleDollarSign}
          subtitle={`${bookings.length} bookings tracked`}
          sparklineData={trendData.map((d) => ({ value: d.bookings }))}
          accent
        />
        <DashboardStatCard
          label="Active Bookings"
          value={activeBookings}
          icon={Clock3}
          subtitle={`Across ${courts.length} listed venues`}
        />
        <DashboardStatCard
          label="Pending Verifications"
          value={pendingVerifications}
          icon={ShieldAlert}
          subtitle="Venue requests awaiting review"
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-label text-base font-semibold text-foreground">
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[620px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
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
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={booking.user?.avatarUrl ?? AVATAR_FALLBACK_IMAGE} alt={booking.user?.name ?? "Guest"} />
                            <AvatarFallback className="rounded-lg bg-primary/10 text-[10px] text-primary">
                              {getInitials(booking.user?.name ?? "Guest")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{booking.user?.name ?? "Guest"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60">
                            <Image src={getVenueImage(booking)} alt={getVenueName(booking)} fill className="object-cover" sizes="56px" />
                          </div>
                          <span className="text-foreground">{getVenueName(booking)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-tertiary">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {formatMoney(Number(booking.totalAmount || 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {topCourt && (
            <Card className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative h-32 sm:h-40">
                <Image
                  src={topCourt.media?.find((m) => m.isPrimary)?.url || topCourt.media?.[0]?.url || VENUE_FALLBACK_IMAGE}
                  alt={topCourt.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-fg shadow-sm backdrop-blur-sm">
                  <Trophy className="h-3 w-3" />
                  Top Venue
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {topCourt.name}
                </h3>
                <p className="mt-0.5 text-xs text-text-tertiary">{topCourt.locationLabel}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {topCourt._count?.bookings ?? 0}{" "}
                    <span className="font-normal text-text-tertiary">bookings</span>
                  </span>
                  <Link
                    href={`/venues/${topCourt.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <OrganizerDashboardCharts
            trendData={trendData}
            occupancyPercent={occupancyPercent}
          />
        </div>
      </div>
    </div>
  );
}
