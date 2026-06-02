"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { courtService } from "@/service/court.service";
import type { CourtStatus, UpdateCourtPayload } from "@/types/court.types";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

type VenueDraft = { name: string; type: string; locationLabel: string; description: string; basePrice: string; status: CourtStatus; };
const STATUS_OPTIONS: CourtStatus[] = ["PENDING_APPROVAL", "ACTIVE", "MAINTENANCE", "HIDDEN"];

export default function VenueDetailsEditorPage({ role, slug }: { role: "ORGANIZER" | "ADMIN"; slug: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Partial<VenueDraft>>({});

  const venueQuery = useQuery({
    queryKey: ["venue-details", slug],
    queryFn: async () => { const r = await courtService.getCourtBySlug(slug); return r.data; },
    staleTime: 30_000,
  });

  const venue = venueQuery.data;
  const formValues: VenueDraft = { name: draft.name ?? venue?.name ?? "", type: draft.type ?? venue?.type ?? "", locationLabel: draft.locationLabel ?? venue?.locationLabel ?? "", description: draft.description ?? venue?.description ?? "", basePrice: draft.basePrice ?? String(venue?.basePrice ?? ""), status: draft.status ?? venue?.status ?? "PENDING_APPROVAL" };
  const isReadOnly = role === "ADMIN";

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!venue) { toast.error("Venue not found"); return; }
      await courtService.updateCourt(venue.id, { name: formValues.name, type: formValues.type, locationLabel: formValues.locationLabel, description: formValues.description, basePrice: Number(formValues.basePrice), status: formValues.status });
    },
    onSuccess: () => { toast.success("Venue details updated"); router.refresh(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  const approveMutation = useMutation({
    mutationFn: async () => { if (!venue) throw new Error("Venue not loaded"); await courtService.approveCourtByAdmin(venue.id); },
    onSuccess: () => { toast.success("Venue approved"); router.push("/admin/venues"); router.refresh(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Approval failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => { if (!venue) throw new Error("Venue not loaded"); await courtService.deleteCourt(venue.id); },
    onSuccess: () => { toast.success("Venue rejected"); router.push("/admin/venues"); router.refresh(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Reject failed"),
  });

  if (venueQuery.isPending) return <DashboardSkeleton />;
  if (!venue) return <Card className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">Venue not found.</Card>;

  const hasChanges = draft.name !== undefined || draft.type !== undefined || draft.locationLabel !== undefined || draft.description !== undefined || draft.basePrice !== undefined || draft.status !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {role === "ADMIN" ? "Venue Review" : "Edit Venue"}
          </h1>
          <p className="text-sm text-text-tertiary">{role === "ADMIN" ? "Review venue details and approve or reject." : "Update venue details and publication status."}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
          {role === "ORGANIZER" && (
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !hasChanges}>
              <Save className="mr-1.5 h-4 w-4" />{updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
          {role === "ADMIN" && (
            <>
              <Button variant="default" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                <CheckCircle className="mr-1.5 h-4 w-4" />Approve
              </Button>
              <Button variant="destructive" onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}>
                <XCircle className="mr-1.5 h-4 w-4" />Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader><CardTitle className="font-label text-base font-semibold text-foreground">Core Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5"><Label>Name</Label><Input value={formValues.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} readOnly={isReadOnly} className={isReadOnly ? "bg-surface-2/50 cursor-not-allowed" : ""} /></div>
            <div className="space-y-1.5"><Label>Type</Label><Input value={formValues.type} onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value }))} readOnly={isReadOnly} className={isReadOnly ? "bg-surface-2/50 cursor-not-allowed" : ""} /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={formValues.locationLabel} onChange={(e) => setDraft((p) => ({ ...p, locationLabel: e.target.value }))} readOnly={isReadOnly} className={isReadOnly ? "bg-surface-2/50 cursor-not-allowed" : ""} /></div>
            <div className="space-y-1.5"><Label>Base Price (USD)</Label><Input type="number" step="0.01" value={formValues.basePrice} onChange={(e) => setDraft((p) => ({ ...p, basePrice: e.target.value }))} readOnly={isReadOnly} className={isReadOnly ? "bg-surface-2/50 cursor-not-allowed" : ""} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label>
            <textarea value={formValues.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} readOnly={isReadOnly} rows={5}
              className={`w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none ${isReadOnly ? "cursor-not-allowed" : ""}`} />
          </div>
          <div className="md:max-w-xs space-y-1.5"><Label>Status</Label>
            {isReadOnly ? (
              <Input value={formValues.status} readOnly className="bg-surface-2/50 cursor-not-allowed" />
            ) : (
              <select value={formValues.status} onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value as CourtStatus }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
