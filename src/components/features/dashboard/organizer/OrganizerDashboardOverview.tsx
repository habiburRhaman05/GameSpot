"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Clock3, ShieldAlert, Trophy, ArrowRight, Activity, TrendingUp, CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import { VENUE_FALLBACK_IMAGE, AVATAR_FALLBACK_IMAGE, getInitials } from "@/lib/placeholders";

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
    <DashboardErrorBoundary fallbackTitle="Organizer Dashboard Error" fallbackMessage="Failed to load organizer dashboard data. Please try again.">
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
                Live
              </span>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Studio Overview
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              Performance insights and real-time operations for your venues.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
            label="Pending Reviews"
            value={pendingVerifications}
            icon={ShieldAlert}
            subtitle="Venue requests awaiting review"
          />
          <DashboardStatCard
            label="Occupancy"
            value={occupancyPercent}
            icon={TrendingUp}
            subtitle="Average venue utilization"
            trend={occupancyPercent > 0 ? { direction: "up", percent: occupancyPercent } : undefined}
          />
        </div>

        {/* ── Charts + Table ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <Card className="rounded-xl border border-border/60 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-label text-base font-semibold text-foreground">
                    Recent Bookings
                  </CardTitle>
                  <p className="mt-0.5 text-[11px] text-text-tertiary">
                    {recentBookings.length} booking{recentBookings.length !== 1 ? "s" : ""} this period
                  </p>
                </div>
              </div>
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
                        <TableCell colSpan={4} className="text-center text-text-tertiary py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Clock3 className="h-8 w-8 text-text-tertiary/40" />
                            <p className="text-sm">No recent bookings found.</p>
                          </div>
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
              <Card className="overflow-hidden rounded-xl border border-border/60 bg-card">
                <div className="relative h-36 sm:h-44">
                  <Image
                    src={topCourt.media?.find((m) => m.isPrimary)?.url || topCourt.media?.[0]?.url || VENUE_FALLBACK_IMAGE}
                    alt={topCourt.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg backdrop-blur-sm">
                    <Trophy className="h-3 w-3" />
                    Top Venue
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display text-lg font-bold tracking-tight text-white drop-shadow-sm">{topCourt.name}</h3>
                    <p className="mt-0.5 text-xs text-white/70">{topCourt.locationLabel}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {topCourt._count?.bookings ?? 0}{" "}
                      <span className="font-normal text-text-tertiary">total bookings</span>
                    </span>
                    <Link
                      href={`/venues/${topCourt.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors"
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
    </DashboardErrorBoundary>
  );
}
