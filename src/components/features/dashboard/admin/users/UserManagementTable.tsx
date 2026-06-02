"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, CalendarCheck2, CircleDollarSign } from "lucide-react";
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
import { getInitials, AVATAR_FALLBACK_IMAGE } from "@/lib/placeholders";

type FilterMode = "ALL_USERS" | "ACTIVE_BOOKERS" | "NO_BOOKINGS";

export default function UserManagementTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL_USERS");

  const usersQuery = useQuery({
    queryKey: ["admin-user-role-management", search],
    queryFn: () => adminService.getUsers({ limit: 300, role: "USER", searchTerm: search.trim() || undefined, sortBy: "-createdAt" }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data?.data]);
  const rows = useMemo(() => {
    if (filterMode === "ALL_USERS") return users;
    if (filterMode === "ACTIVE_BOOKERS") return users.filter((u) => (u._count?.bookings ?? 0) > 0);
    return users.filter((u) => (u._count?.bookings ?? 0) === 0);
  }, [users, filterMode]);

  const totalBookings = users.reduce((sum, u) => sum + (u._count?.bookings ?? 0), 0);
  const activeBookerCount = users.filter((u) => (u._count?.bookings ?? 0) > 0).length;

  const promoteMutation = useMutation({
    mutationFn: (userId: string) => adminService.changeUserRole(userId, "ORGANIZER"),
    onSuccess: async () => {
      toast.success("User promoted to organizer");
      await queryClient.invalidateQueries({ queryKey: ["admin-user-role-management"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to promote user");
    },
  });

  if (usersQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          User Management
        </h1>
        <p className="text-sm text-text-tertiary">
          Manage USER-role accounts, review booking activity, and track connected venues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard label="Total Users" value={users.length} icon={Users} subtitle="Accounts with USER role" />
        <DashboardStatCard label="Active Bookers" value={activeBookerCount} icon={CalendarCheck2} subtitle="Users with at least one booking" />
        <DashboardStatCard label="Total Bookings" value={totalBookings} icon={CircleDollarSign} subtitle="Bookings linked to USER accounts" accent />
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader className="space-y-4">
          <CardTitle className="font-label text-base font-semibold text-foreground">
            Users Table
          </CardTitle>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {([{ key: "ALL_USERS", label: "All" }, { key: "ACTIVE_BOOKERS", label: "Active Bookers" }, { key: "NO_BOOKINGS", label: "No Bookings" }] as const).map((item) => (
                <Button key={item.key} type="button" variant={filterMode === item.key ? "default" : "outline"} size="sm" onClick={() => setFilterMode(item.key)}>
                  {item.label}
                </Button>
              ))}
            </div>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone..." className="h-9 w-full md:w-72" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.isLoading && (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center"><LoadingSpinner label="Loading users..." className="justify-center" /></TableCell></TableRow>
                )}
                {!usersQuery.isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center text-text-tertiary">No user records found for this filter.</TableCell></TableRow>
                )}
                {!usersQuery.isLoading && rows.map((user) => (
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
                    <TableCell><Badge variant="outline">USER</Badge></TableCell>
                    <TableCell className="text-text-tertiary">{user._count?.bookings ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="default" disabled={promoteMutation.isPending} onClick={() => promoteMutation.mutate(user.id)}>
                        Make Organizer
                      </Button>
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
