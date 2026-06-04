"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { courtService } from "@/service/court.service";
import { scheduleService } from "@/service/schedule.service";
import type { CourtListItem } from "@/types/court.types";
import type { SlotTemplate, SlotTemplatesByDay } from "@/types/schedule.types";
import { cn } from "@/lib/utils";

const DAYS = [
  { value: 1, short: "MON", full: "Monday" },
  { value: 2, short: "TUE", full: "Tuesday" },
  { value: 3, short: "WED", full: "Wednesday" },
  { value: 4, short: "THU", full: "Thursday" },
  { value: 5, short: "FRI", full: "Friday" },
  { value: 6, short: "SAT", full: "Saturday" },
  { value: 0, short: "SUN", full: "Sunday" },
];

const timeToMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (value: number) => {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
};

const normalizeSlots = (data: SlotTemplatesByDay | undefined) => {
  const normalized: Record<number, SlotTemplate[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  if (!data) return normalized;
  for (const [key, slots] of Object.entries(data)) {
    const nk = Number(key);
    if (Number.isNaN(nk)) continue;
    normalized[nk] = [...slots].sort((a, b) => a.startMinute - b.startMinute);
  }
  return normalized;
};

export default function ScheduleManagementPage() {
  const queryClient = useQueryClient();
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [mobileDay, setMobileDay] = useState(1);
  const [draftDay, setDraftDay] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [priceOverride, setPriceOverride] = useState("");

  const courtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["organizer-schedule-courts"],
    queryFn: async () => { const r = await courtService.getOrganizerCourts({ limit: 100 }); return r.data ?? []; },
    staleTime: 60_000,
  });

  const courts = useMemo(() => courtsQuery.data ?? [], [courtsQuery.data]);
  const effectiveCourtId = selectedCourtId || courts[0]?.id || "";
  const selectedCourt = courts.find((c) => c.id === effectiveCourtId) ?? null;

  const slotsQuery = useQuery<SlotTemplatesByDay>({
    queryKey: ["organizer-slot-templates", effectiveCourtId],
    enabled: Boolean(effectiveCourtId),
    queryFn: async () => { const r = await scheduleService.getSlotTemplates(effectiveCourtId); return r.data ?? {}; },
    staleTime: 30_000,
  });

  const slotsByDay = useMemo(() => normalizeSlots(slotsQuery.data), [slotsQuery.data]);
  const totalWeeklySlots = useMemo(() => Object.values(slotsByDay).reduce((s, d) => s + d.length, 0), [slotsByDay]);

  const createSlotMutation = useMutation({
    mutationFn: () => {
      const startMin = timeToMinutes(startTime);
      const endMin = timeToMinutes(endTime);
      if (startMin >= endMin) throw new Error("Start time must be before end time");
      return scheduleService.createSlotTemplate(effectiveCourtId, {
        dayOfWeek: draftDay, startMinute: startMin, endMinute: endMin,
        priceOverride: priceOverride.trim() === "" ? undefined : Number(priceOverride),
      });
    },
    onSuccess: async () => { toast.success("Slot added"); setPriceOverride(""); await queryClient.invalidateQueries({ queryKey: ["organizer-slot-templates", effectiveCourtId] }); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to add slot"),
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (templateId: string) => scheduleService.deleteSlotTemplate(templateId),
    onSuccess: async () => { toast.success("Slot removed"); await queryClient.invalidateQueries({ queryKey: ["organizer-slot-templates", effectiveCourtId] }); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete slot"),
  });

  if (courtsQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Schedule Templates</h1>
        <p className="text-sm text-text-tertiary">Manage weekly slot templates per venue.</p>
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader><CardTitle className="font-label text-base font-semibold text-foreground">Select Venue</CardTitle></CardHeader>
        <CardContent>
          {courts.length === 0 && <p className="text-sm text-text-tertiary">No venues found. Create a venue first.</p>}
          <div className="flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 xl:grid-cols-3">
            {courts.map((court) => (
              <button key={court.id} type="button" onClick={() => setSelectedCourtId(court.id)}
                className={cn("min-w-[84%] snap-start rounded-xl border p-4 text-left transition-all md:min-w-0", effectiveCourtId === court.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:border-primary/30")}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-label font-semibold text-foreground">{court.name}</p>
                  <Badge variant={court.status === "ACTIVE" ? "success" : "default"}>{court.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-text-tertiary">{court.locationLabel}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCourt && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-label font-semibold uppercase tracking-wider text-text-tertiary">Venue</p><p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{selectedCourt.name}</p></Card>
            <Card className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-label font-semibold uppercase tracking-wider text-text-tertiary">Weekly Slots</p><p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">{totalWeeklySlots}</p></Card>
            <Card className="rounded-xl bg-primary/10 border border-primary/20 p-4"><p className="text-[10px] font-label font-semibold uppercase tracking-wider text-primary/70">Slot Mode</p><p className="mt-1 font-display text-xl font-semibold tracking-tight text-primary">Template Based</p></Card>
          </div>

          <Card className="rounded-xl border border-border bg-card">
            <CardHeader><CardTitle className="font-label text-base font-semibold text-foreground">Add Slot</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1"><Label className="text-[10px] font-semibold uppercase tracking-wider">Day</Label>
                <Select value={draftDay} onChange={(e) => setDraftDay(Number(e.target.value))}>
                  {DAYS.map((d) => <option key={d.value} value={d.value}>{d.full}</option>)}
                </Select>
              </div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold uppercase tracking-wider">Start</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold uppercase tracking-wider">End</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold uppercase tracking-wider">Price Override</Label><Input type="number" step="0.01" placeholder="Optional" value={priceOverride} onChange={(e) => setPriceOverride(e.target.value)} /></div>
              <div className="flex items-end">
                <Button className="h-10 w-full" onClick={() => createSlotMutation.mutate()} disabled={createSlotMutation.isPending || !effectiveCourtId}><Plus className="mr-2 h-4 w-4" />Add Slot</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-card">
            <CardHeader><CardTitle className="font-label text-base font-semibold text-foreground">Weekly Schedule Grid</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
                {DAYS.map((d) => (
                  <button key={d.value} type="button" onClick={() => setMobileDay(d.value)}
                    className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider", mobileDay === d.value ? "border-primary bg-primary text-primary-fg" : "border-border bg-card text-text-tertiary")}>
                    {d.short}
                  </button>
                ))}
              </div>
              <div className="md:hidden">
                {(() => { const d = DAYS.find((d) => d.value === mobileDay) ?? DAYS[0]; const daySlots = slotsByDay[d.value] ?? []; return (
                  <div className="min-h-56 rounded-xl border border-border bg-card p-4">
                    <p className="font-label font-semibold text-foreground">{d.short} · {d.full}</p>
                    <div className="mt-4 space-y-2">
                      {daySlots.length === 0 && <p className="pt-4 text-center text-xs text-text-tertiary">No slots</p>}
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-2/50 p-3">
                          <div>
                            <p className="font-mono text-sm font-semibold text-foreground">{minutesToTime(slot.startMinute)} – {minutesToTime(slot.endMinute)}</p>
                            <p className="text-[10px] text-text-tertiary">{slot.priceOverride == null ? "Default price" : `USD ${Number(slot.priceOverride).toFixed(2)}`}</p>
                          </div>
                          <button onClick={() => deleteSlotMutation.mutate(slot.id)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                );})()}
              </div>
              <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-7">
                {DAYS.map((d) => { const daySlots = slotsByDay[d.value] ?? []; return (
                  <div key={d.value} className="min-h-56 rounded-xl border border-border bg-card p-3">
                    <p className="font-label text-sm font-semibold text-foreground">{d.short}</p>
                    <p className="text-[10px] uppercase tracking-wider text-text-tertiary">{d.full}</p>
                    <div className="mt-3 space-y-2">
                      {daySlots.length === 0 && <p className="pt-4 text-center text-xs text-text-tertiary">No slots</p>}
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="rounded-lg border border-border/60 bg-surface-2/30 p-2">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-mono text-[11px] font-semibold text-foreground">{minutesToTime(slot.startMinute)}–{minutesToTime(slot.endMinute)}</p>
                            <button onClick={() => deleteSlotMutation.mutate(slot.id)} className="text-destructive/70 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-[10px] text-text-tertiary">{slot.priceOverride == null ? "Default" : `USD ${Number(slot.priceOverride).toFixed(2)}`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );})}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
