"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCheck, Users, UserRoundPlus, Activity, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { adminService } from "@/service/admin.service";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";
import type { AdminUser } from "@/types/admin.types";
import { getInitials, AVATAR_FALLBACK_IMAGE } from "@/lib/placeholders";

type FilterMode = "ALL" | "ORGANIZER" | "CANDIDATES";

export default function OrganizerManagementTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ORGANIZER");

  const usersQuery = useQuery({
    queryKey: ["admin-users-management", search],
    queryFn: () => adminService.getUsers({ limit: 200, searchTerm: search.trim() || undefined, sortBy: "-createdAt" }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const allUsers = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);
  const manageableUsers = useMemo(() => allUsers.filter((u) => u.role !== "ADMIN"), [allUsers]);

  const rows = useMemo(() => {
    if (filterMode === "ALL") return manageableUsers.filter((u) => u.role === "ORGANIZER");
    if (filterMode === "ORGANIZER") return manageableUsers.filter((u) => u.role === "ORGANIZER");
    return manageableUsers.filter((u) => u.role === "USER" && Boolean(u.organizerProfile));
  }, [manageableUsers, filterMode]);

  const organizerCount = manageableUsers.filter((u) => u.role === "ORGANIZER").length;
  const candidatesCount = manageableUsers.filter((u) => u.role === "USER" && Boolean(u.organizerProfile)).length;

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AdminUser["role"] }) => adminService.changeUserRole(userId, role),
    onSuccess: async (_result, variables) => {
      toast.success(variables.role === "ORGANIZER" ? "Organizer verified" : "Organizer demoted to user");
      await queryClient.invalidateQueries({ queryKey: ["admin-users-management"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    },
  });

  if (usersQuery.isPending) return <DashboardSkeleton />;

  return (
    <DashboardErrorBoundary fallbackTitle="Organizer Management Error" fallbackMessage="Failed to load organizer data. Please try again.">
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
              <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
              Live
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Organizer Management
            </h1>
          </div>
          <p className="text-sm text-text-secondary">Manage organizer verification and role transitions.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard label="Total Users" value={manageableUsers.length} icon={Users} subtitle="Non-admin accounts" />
        <DashboardStatCard label="Organizers" value={organizerCount} icon={UserCheck} subtitle="Currently assigned organizer role" />
        <DashboardStatCard label="Candidates" value={candidatesCount} icon={UserRoundPlus} subtitle="Ready for promotion" accent />
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader className="space-y-4">
          <CardTitle className="font-label text-base font-semibold text-foreground">Organizers Table</CardTitle>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {([{ key: "ORGANIZER", label: "Organizers" }, { key: "CANDIDATES", label: "Candidates" }, { key: "ALL", label: "All" }] as const).map((item) => (
                <Button key={item.key} type="button" variant={filterMode === item.key ? "default" : "outline"} size="sm" onClick={() => setFilterMode(item.key)}>
                  {item.label}
                </Button>
              ))}
            </div>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email..." className="h-9 w-full md:w-72" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.isLoading && (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center"><LoadingSpinner label="Loading users..." className="justify-center" /></TableCell></TableRow>
                )}
                {!usersQuery.isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center text-text-tertiary">No users found for this filter.</TableCell></TableRow>
                )}
                {!usersQuery.isLoading && rows.map((user) => {
                  const isOrganizer = user.role === "ORGANIZER";
                  const verified = isOrganizer && Boolean(user.organizerProfile?.isVerified);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatarUrl ?? AVATAR_FALLBACK_IMAGE} alt={user.name} />
                            <AvatarFallback className="rounded-lg bg-primary/10 text-[10px] text-primary">{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-text-tertiary">{user.email}</TableCell>
                      <TableCell className="text-text-tertiary">{user.phone ?? "—"}</TableCell>
                      <TableCell><Badge variant={isOrganizer ? "default" : "outline"}>{isOrganizer ? "Organizer" : "User"}</Badge></TableCell>
                      <TableCell><Badge variant={verified ? "success" : "warning"}>{verified ? "Verified" : "Pending"}</Badge></TableCell>
                      <TableCell className="text-text-tertiary">{user._count?.bookings ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!isOrganizer && (
                            <Button size="sm" variant="default" disabled={changeRoleMutation.isPending} onClick={() => changeRoleMutation.mutate({ userId: user.id, role: "ORGANIZER" })}>
                              Verify
                            </Button>
                          )}
                          {isOrganizer && (
                            <Button size="sm" variant="outline" disabled={changeRoleMutation.isPending} onClick={() => changeRoleMutation.mutate({ userId: user.id, role: "USER" })}>
                              Demote
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardErrorBoundary>
  );
}
