"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2, LayoutGrid, Gauge, Activity } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { courtService } from "@/service/court.service";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";
import { cn } from "@/lib/utils";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";

const statusBadge = (status: string) => {
  if (status === "ACTIVE") return "success";
  if (status === "PENDING_APPROVAL") return "warning";
  if (status === "MAINTENANCE") return "default";
  return "destructive";
};

export default function VenuePortfolioPage({ role }: { role: "ORGANIZER" | "ADMIN" }) {
  const queryClient = useQueryClient();

  const venuesQuery = useQuery({
    queryKey: ["venue-portfolio", role],
    queryFn: async () => {
      const response = role === "ADMIN"
        ? await courtService.getPendingCourtsForAdmin({ limit: 100 })
        : await courtService.getOrganizerCourts({ limit: 100 });
      return response.data ?? [];
    },
    staleTime: 60_000,
  });

  const venues = venuesQuery.data ?? [];
  const totalAssets = venues.length;
  const totalBookings = venues.reduce((sum, v) => sum + (v._count?.bookings ?? 0), 0);
  const avgOccupancy = totalAssets === 0 ? 0 : Math.round((totalBookings / totalAssets) * 7.5);

  const hideVenueMutation = useMutation({
    mutationFn: (courtId: string) => courtService.deleteCourt(courtId),
    onSuccess: async () => {
      toast.success(role === "ADMIN" ? "Venue rejected" : "Venue archived");
      await queryClient.invalidateQueries({ queryKey: ["venue-portfolio", role] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update venue"),
  });

  if (venuesQuery.isPending) return <DashboardSkeleton />;

  return (
    <DashboardErrorBoundary fallbackTitle="Venue Portfolio Error" fallbackMessage="Failed to load venue data. Please try again.">
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_480px] lg:items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
              <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
              Live
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Venue Portfolio</h1>
          </div>
          <p className="text-sm text-text-secondary">
            {role === "ADMIN" ? "Review organizer venues and decide approval status." : "Manage your venue portfolio."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DashboardStatCard label="Total Assets" value={totalAssets} icon={LayoutGrid} subtitle="Venues in portfolio" />
          <DashboardStatCard label="Avg Occupancy" value={avgOccupancy} icon={Gauge} subtitle={`${totalBookings} total bookings`} accent />
        </div>
      </div>

      {venues.length === 0 && (
        <Card className="rounded-xl border border-border bg-card"><CardContent className="p-6 text-sm text-text-tertiary">
          {role === "ADMIN" ? "No pending venues found." : "No venues yet. Add your first venue."}
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {venues.map((venue) => {
          const heroImage = venue.media?.[0]?.url;
          const href = role === "ADMIN" ? `/admin/venues/${venue.slug}` : `/organizer/venues/${venue.slug}/edit`;
          return (
            <Card key={venue.id} className="group overflow-hidden rounded-xl border border-border bg-card p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong">
              <div className="relative aspect-[16/10] overflow-hidden">
                {heroImage ? (
                  <Image src={heroImage} alt={venue.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-surface-2 to-border" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute right-3 top-3"><Badge variant={statusBadge(venue.status)as any}>{venue.status.replaceAll("_", " ")}</Badge></div>
              </div>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground truncate">{venue.name}</h3>
                    <p className="text-xs text-text-tertiary truncate">{venue.locationLabel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-text-tertiary">Bookings</p>
                    <p className="font-display text-lg font-semibold text-foreground">{venue._count?.bookings ?? 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={href} className="flex-1"><Button size="sm" className="w-full"><Eye className="mr-1.5 h-4 w-4" />{role === "ADMIN" ? "Review" : "View"}</Button></Link>
                  {role === "ORGANIZER" && (
                    <Link href={href}><Button size="sm" variant="outline" className="aspect-square p-0"><Pencil className="h-4 w-4" /></Button></Link>
                  )}
                  <Button size="sm" variant="outline" className="aspect-square p-0 text-destructive" onClick={() => hideVenueMutation.mutate(venue.id)} disabled={hideVenueMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {role === "ORGANIZER" && (
          <Link href="/organizer/venues/new" className="flex min-h-[360px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/[0.02]">
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <p className="font-display text-xl font-semibold tracking-tight text-foreground">Add Venue</p>
              <p className="text-xs text-text-tertiary">Expand your portfolio.</p>
            </div>
          </Link>
        )}
      </div>
    </div>
    </DashboardErrorBoundary>
  );
}
