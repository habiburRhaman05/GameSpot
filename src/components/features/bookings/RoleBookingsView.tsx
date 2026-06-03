"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, MapPin, CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingService } from "@/service/booking.service";
import { courtService } from "@/service/court.service";
import { DashboardErrorBoundary } from "@/components/features/dashboard/shared/DashboardErrorBoundary";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking.types";
import type { CourtListItem } from "@/types/court.types";
import { UniversalBookingTable, type BookingActorRole } from "./UniversalBookingTable";

type RoleBookingsViewProps = { role: BookingActorRole };

export function RoleBookingsView({ role }: RoleBookingsViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCourtId, setSelectedCourtId] = useState("");

  const heading = role === "ADMIN" ? "Booking Management" : role === "ORGANIZER" ? "Venue Bookings" : "My Bookings";

  const courtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["bookings-courts", role],
    enabled: role !== "USER",
    queryFn: async () => {
      const response = role === "ORGANIZER" ? await courtService.getOrganizerCourts({ limit: 100 }) : await courtService.getAllCourts({ limit: 100 });
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 60_000,
  });

  const courts = useMemo(() => courtsQuery.data ?? [], [courtsQuery.data]);
  const effectiveCourtId = role === "USER" ? "self" : (selectedCourtId || courts[0]?.id || "");
  const isVenueSelected = role === "USER" || Boolean(effectiveCourtId);

  const bookingsQuery = useQuery<Booking[]>({
    queryKey: ["role-bookings", role, effectiveCourtId],
    enabled: isVenueSelected,
    queryFn: async () => {
      if (role === "USER") { const r = await BookingService.getUserBookings({ limit: 100 }); return Array.isArray(r.data) ? r.data : []; }
      const r = await BookingService.getCourtBookings(effectiveCourtId, { limit: 100 });
      return Array.isArray(r.data) ? r.data : [];
    },
    staleTime: 30_000,
  });

  const refresh = async () => { await queryClient.invalidateQueries({ queryKey: ["role-bookings", role] }); };

  const approveMutation = useMutation({ mutationFn: (id: string) => BookingService.approveBooking(id), onSuccess: async () => { toast.success("Approved"); await refresh(); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Failed") });
  const rejectMutation = useMutation({ mutationFn: (id: string) => BookingService.rejectBooking(id), onSuccess: async () => { toast.success("Rejected"); await refresh(); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Failed") });
  const cancelMutation = useMutation({ mutationFn: (id: string) => BookingService.cancelBooking(id), onSuccess: async () => { toast.success("Cancelled"); await refresh(); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Failed") });

  const bookings = useMemo(() => (bookingsQuery.data ?? []).map((b) => {
    if (b.court?.name) return b;
    const fc = courts.find((c) => c.id === b.courtId);
    return fc ? { ...b, court: { id: fc.id, name: fc.name, slug: fc.slug, basePrice: fc.basePrice, media: fc.media } } : b;
  }), [bookingsQuery.data, courts]);

  const loading = bookingsQuery.isLoading || (role !== "USER" && courtsQuery.isLoading);

  useEffect(() => {
    if (bookingsQuery.error) toast.error(bookingsQuery.error instanceof Error ? bookingsQuery.error.message : "Failed to fetch bookings");
  }, [bookingsQuery.error]);

  if (role !== "USER" && !isVenueSelected) {
    return (
    <DashboardErrorBoundary fallbackTitle="Bookings Error" fallbackMessage="Failed to load booking data. Please try again.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Select Venue</h2>
          <p className="text-xs text-text-tertiary">{courts.length} venues</p>
        </div>
        {courts.length === 0 && !loading && (
          <Card className="rounded-xl border border-border bg-card"><CardContent className="p-6 text-sm text-text-tertiary">No venues found. Create a venue first.</CardContent></Card>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courts.map((court) => {
            const venueImage = court.media?.find((m) => m.isPrimary)?.url ?? court.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE;
            return (
              <button key={court.id} type="button" onClick={() => setSelectedCourtId(court.id)}
                className="group relative w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/40">
                <div className="relative h-40 overflow-hidden border-b border-border/60">
                  <Image src={venueImage} alt={court.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <Badge className="absolute left-3 top-3">{court.status.replaceAll("_", " ")}</Badge>
                  <p className="absolute bottom-3 left-3 right-3 font-display text-lg font-semibold tracking-tight text-white">{court.name}</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-1.5 text-xs text-text-tertiary">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-2">{court.locationLabel}</span>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-surface-2/30 p-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-text-tertiary"><CalendarClock className="h-3.5 w-3.5" />Bookings</span>
                    <span className="font-display text-base font-semibold text-foreground">{court._count?.bookings ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-text-tertiary">Open Control</span>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardErrorBoundary>
    );
  }

  return (
    <DashboardErrorBoundary fallbackTitle="Bookings Error" fallbackMessage="Failed to load booking data. Please try again.">
    <div className="space-y-4">
      {role !== "USER" && (
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Bookings for {courts.find((c) => c.id === effectiveCourtId)?.name ?? "Venue"}</h2>
          <Button variant="outline" size="sm" onClick={() => setSelectedCourtId("")}>Change Venue</Button>
        </div>
      )}
      <UniversalBookingTable
        role={role} heading={heading} bookings={bookings} loading={loading}
        onView={(b) => router.push(`/checkout/success?bookingId=${b.id}`)}
        onPay={role === "USER" ? (b) => router.push(`/checkout?bookingId=${b.id}`) : undefined}
        onCancel={role === "ADMIN" ? undefined : (b) => cancelMutation.mutate(b.id)}
        onApprove={role === "ORGANIZER" ? (b) => approveMutation.mutate(b.id) : undefined}
        onReject={role === "ORGANIZER" ? (b) => rejectMutation.mutate(b.id) : undefined}
      />
    </div>
    </DashboardErrorBoundary>
  );
}
