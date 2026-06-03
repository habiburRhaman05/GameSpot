"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, UserCheck, Users, Trophy, ArrowRight, Activity, BarChart3, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";
import { adminService } from "@/service/admin.service";
import { courtService } from "@/service/court.service";
import { useApproveCourtMutation } from "@/hooks/queries/use-court-mutation";

const AdminDashboardCharts = dynamic(
  () => import("./AdminDashboardCharts").then((mod) => mod.AdminDashboardCharts),
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

export default function AdminDashboardOverview() {
  const approveMutation = useApproveCourtMutation();

  const usersQuery = useQuery({
    queryKey: ["admin-dashboard-users"],
    queryFn: () => adminService.getUsers({ limit: 200, sortBy: "-createdAt" }),
    staleTime: 30_000,
  });

  const pendingCourtsQuery = useQuery({
    queryKey: ["admin-dashboard-pending-courts"],
    queryFn: () => courtService.getPendingCourtsForAdmin({ limit: 50 }),
    staleTime: 30_000,
  });

  const topCourtQuery = useQuery({
    queryKey: ["admin-dashboard-top-court"],
    queryFn: async () => {
      const response = await courtService.getAllCourts({ limit: 50 });
      if (!response.data || response.data.length === 0) return null;
      const sorted = [...response.data].sort((a, b) => (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0));
      if ((sorted[0]?._count?.bookings ?? 0) === 0) return null;
      return sorted[0];
    },
    staleTime: 60_000,
  });

  const topCourt = topCourtQuery.data;
  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);
  const pendingCourts = useMemo(() => pendingCourtsQuery.data?.data ?? [], [pendingCourtsQuery.data?.data]);

  const organizerUsers = users.filter((u) => u.role === "ORGANIZER");
  const approvedOrganizers = organizerUsers.filter((u) => u.isApproved).length;
  const totalUsers = users.length;
  const totalOrganizers = organizerUsers.length;
  const pendingVerifications = pendingCourts.length;
  const approvalPercent = totalOrganizers === 0 ? 0 : Math.round((approvedOrganizers / totalOrganizers) * 100);

  const monthlyRegistrations = useMemo(() => {
    const monthMap = new Map<string, number>();
    for (const user of users) {
      const monthLabel = new Date(user.createdAt).toLocaleString("en-US", { month: "short" });
      monthMap.set(monthLabel, (monthMap.get(monthLabel) ?? 0) + 1);
    }
    return Array.from(monthMap.entries()).map(([month, count]) => ({ month, registrations: count }));
  }, [users]);

  // Quick stats for the secondary row
  const activeUsersToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return users.filter((u) => new Date(u.createdAt) >= today).length;
  }, [users]);

  if (usersQuery.isPending || pendingCourtsQuery.isPending || topCourtQuery.isPending) return <DashboardSkeleton />;

  return (
    <DashboardErrorBoundary fallbackTitle="Admin Dashboard Error" fallbackMessage="Failed to load admin dashboard data. Please try again.">
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-tertiary/20 bg-tertiary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-tertiary">
                <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
                Live
              </span>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Admin Console
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              Platform insights and verification operations across users and venues.
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
            label="Total Users"
            value={totalUsers}
            icon={Users}
            subtitle="Registered platform accounts"
            sparklineData={monthlyRegistrations.map((d) => ({ value: d.registrations }))}
          />
          <DashboardStatCard
            label="Organizers"
            value={totalOrganizers}
            icon={UserCheck}
            subtitle={`${approvedOrganizers} approved`}
          />
          <DashboardStatCard
            label="Pending Reviews"
            value={pendingVerifications}
            icon={ShieldAlert}
            subtitle="Venue approvals awaiting review"
            accent
          />
          <DashboardStatCard
            label="New Today"
            value={activeUsersToday}
            icon={BarChart3}
            subtitle="Registrations today"
          />
        </div>

        {/* ── Charts ── */}
        <AdminDashboardCharts monthlyRegistrations={monthlyRegistrations} approvalPercent={approvalPercent} />

        {/* ── Tables & cards ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <Card className="rounded-xl border border-border/60 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-label text-base font-semibold text-foreground">
                    Pending Venue Verifications
                  </CardTitle>
                  <p className="mt-0.5 text-[11px] text-text-tertiary">
                    {pendingCourts.length} venue{pendingCourts.length !== 1 ? "s" : ""} awaiting review
                  </p>
                </div>
                {pendingCourts.length > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-tertiary/15 px-2 text-[10px] font-bold text-tertiary">
                    {pendingCourts.length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-[620px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Venue</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCourts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-text-tertiary py-12">
                          <div className="flex flex-col items-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-text-tertiary/40" />
                            <p className="text-sm">No pending venue verification requests.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {pendingCourts.slice(0, 6).map((court) => (
                      <TableRow key={court.id}>
                        <TableCell className="font-medium text-foreground">{court.name}</TableCell>
                        <TableCell className="text-text-tertiary">{court.organizer?.user?.name ?? "N/A"}</TableCell>
                        <TableCell className="text-text-tertiary">{court.locationLabel}</TableCell>
                        <TableCell className="text-text-tertiary">{new Date(court.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => {
                              toast.promise(approveMutation.mutateAsync(court.id), {
                                loading: `Approving ${court.name}...`,
                                success: `${court.name} approved successfully`,
                                error: "Failed to approve venue",
                              });
                            }}
                            disabled={approveMutation.isPending}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

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
                  <Link href={`/venues/${topCourt.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors">
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardErrorBoundary>
  );
}
