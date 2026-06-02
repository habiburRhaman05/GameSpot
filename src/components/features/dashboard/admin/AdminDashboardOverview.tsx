"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, UserCheck, Users, Trophy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  if (usersQuery.isPending || pendingCourtsQuery.isPending || topCourtQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Admin Console
        </h1>
        <p className="text-sm text-text-tertiary">
          Platform insights and verification operations across users and venues.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <DashboardStatCard label="Total Users" value={totalUsers} icon={Users} subtitle="Registered platform accounts" />
        <DashboardStatCard label="Organizers" value={totalOrganizers} icon={UserCheck} subtitle={`${approvedOrganizers} approved`} />
        <DashboardStatCard label="Pending Verifications" value={pendingVerifications} icon={ShieldAlert} subtitle="Venue approvals awaiting review" accent className="col-span-2 md:col-span-1" />
      </div>

      <AdminDashboardCharts monthlyRegistrations={monthlyRegistrations} approvalPercent={approvalPercent} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-label text-base font-semibold text-foreground">
              Pending Venue Verifications
            </CardTitle>
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
                      <TableCell colSpan={5} className="text-center text-text-tertiary py-8">
                        No pending venue verification requests.
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
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{topCourt.name}</h3>
              <p className="mt-0.5 text-xs text-text-tertiary">{topCourt.locationLabel}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {topCourt._count?.bookings ?? 0}{" "}
                  <span className="font-normal text-text-tertiary">bookings</span>
                </span>
                <Link href={`/venues/${topCourt.slug}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors">
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
