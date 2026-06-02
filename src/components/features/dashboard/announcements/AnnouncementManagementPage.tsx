"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, BellRing, Building2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { queryKeys } from "@/lib/query/query-keys";
import { announcementService } from "@/service/announcement.service";
import { courtService } from "@/service/court.service";
import type { CourtListItem } from "@/types/court.types";
import type { Announcement, AnnouncementType, CreateAnnouncementPayload, UpdateAnnouncementPayload } from "@/types/announcement.types";

type Role = "ADMIN" | "ORGANIZER";

type AnnouncementFormState = {
  title: string; content: string; type: AnnouncementType; imageUrl: string; isPublished: boolean; courtId: string;
};

const defaultFormState: AnnouncementFormState = { title: "", content: "", type: "INFO", imageUrl: "", isPublished: true, courtId: "" };

const typeBadgeClass = (type: AnnouncementType) => {
  if (type === "INFO") return "default";
  if (type === "MAINTENANCE") return "warning";
  return "success";
};

const formatDateLabel = (value: string | null) => {
  if (!value) return "Draft";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Invalid date" : format(parsed, "MMM dd, yyyy");
};

export default function AnnouncementManagementPage({ role }: { role: Role }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementFormState>(defaultFormState);
  const [selectedCourtId, setSelectedCourtId] = useState("");

  const organizerCourtsQuery = useQuery<CourtListItem[]>({
    queryKey: ["organizer-announcement-courts"],
    queryFn: async () => { const r = await courtService.getOrganizerCourts({ limit: 100 }); return r.data ?? []; },
    enabled: role === "ORGANIZER",
    staleTime: 60_000,
  });

  const organizerCourts = organizerCourtsQuery.data ?? [];
  const activeCourtId = selectedCourtId || (role === "ORGANIZER" ? (organizerCourts[0]?.id ?? "") : "");

  const announcementQueryParams = useMemo(() => ({
    page: 1, limit: 200, sortBy: "-createdAt" as const,
    searchTerm: search.trim() || undefined,
    audience: role === "ADMIN" ? "HOME" as const : "VENUE" as const,
    ...(role === "ORGANIZER" && activeCourtId ? { courtId: activeCourtId } : {}),
  }), [activeCourtId, role, search]);

  const announcementsQuery = useQuery({
    queryKey: queryKeys.announcements.list(announcementQueryParams),
    queryFn: () => announcementService.getAllAnnouncements(announcementQueryParams),
    enabled: role === "ADMIN" || Boolean(activeCourtId),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const announcements = useMemo(() => announcementsQuery.data?.data ?? [], [announcementsQuery.data?.data]);
  const publishedCount = announcements.filter((a) => a.isPublished).length;
  const draftCount = announcements.length - publishedCount;

  const createMutation = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => announcementService.createAnnouncement(payload),
    onSuccess: async () => { toast.success("Announcement created"); setOpenFormDialog(false); setEditing(null); setForm(defaultFormState); await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all }); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create announcement"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ announcementId, payload }: { announcementId: string; payload: UpdateAnnouncementPayload }) => announcementService.updateAnnouncement(announcementId, payload),
    onSuccess: async () => { toast.success("Announcement updated"); setOpenFormDialog(false); setEditing(null); setForm(defaultFormState); await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all }); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update announcement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (announcementId: string) => announcementService.deleteAnnouncement(announcementId),
    onSuccess: async () => { toast.success("Announcement deleted"); await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all }); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete announcement"),
  });

  const handleSubmit = () => {
    const title = form.title.trim();
    const content = form.content.trim();
    if (title.length < 3) { toast.error("Title must be at least 3 characters"); return; }
    if (content.length < 10) { toast.error("Content must be at least 10 characters"); return; }

    const base: any = { title, content, type: form.type, isPublished: form.isPublished, imageUrl: form.imageUrl.trim() || null };
    if (editing) {
      updateMutation.mutate({ announcementId: editing.id, payload: base });
    } else {
      createMutation.mutate({ ...base, audience: role === "ADMIN" ? "HOME" : "VENUE", courtId: role === "ORGANIZER" ? (activeCourtId || undefined) : undefined });
    }
  };

  const isInitialLoading = (announcementsQuery.isPending && (role === "ADMIN" || Boolean(activeCourtId))) || (role === "ORGANIZER" && organizerCourtsQuery.isPending);
  if (isInitialLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Announcement Control</h1>
        <p className="text-sm text-text-tertiary">{role === "ADMIN" ? "Create and publish announcements for the home landing page." : "Create and publish venue-specific announcements."}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard label="Total" value={announcements.length} icon={Megaphone} subtitle="Announcements in scope" />
        <DashboardStatCard label="Published" value={publishedCount} icon={BellRing} subtitle="Visible to users" />
        <DashboardStatCard label="Drafts" value={draftCount} icon={Building2} subtitle="Pending publication" accent />
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-label text-base font-semibold text-foreground">Announcements</CardTitle>
            <Dialog open={openFormDialog} onOpenChange={(next) => { setOpenFormDialog(next); if (!next) { setEditing(null); setForm(defaultFormState); }}}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditing(null); setForm(defaultFormState); }}>Add Announcement</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-semibold tracking-tight">{editing ? "Edit" : "Create New"} Announcement</DialogTitle>
                  <DialogDescription>{editing ? "Update content, status, and type." : "Create a new announcement and choose whether to publish."}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Venue maintenance update" /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Content</Label>
                    <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={4} placeholder="Write the announcement details..." className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                  </div>
                  <div className="space-y-2"><Label>Type</Label>
                    <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as AnnouncementType }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                      <option value="INFO">Info</option><option value="MAINTENANCE">Maintenance</option><option value="PROMOTION">Promotion</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/banner.jpg" /></div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="pub" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="rounded" />
                    <Label htmlFor="pub">Publish immediately</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                    {editing ? "Save Changes" : "Create Announcement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..." className="h-9 max-w-sm" />
            {role === "ORGANIZER" && organizerCourts.length > 0 && (
              <select value={activeCourtId} onChange={(e) => setSelectedCourtId(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
                {organizerCourts.map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Audience</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center text-text-tertiary">No announcements found.</TableCell></TableRow>
                )}
                {announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <p className="line-clamp-1 font-medium text-foreground">{a.title}</p>
                      <p className="line-clamp-2 text-xs text-text-tertiary">{a.content}</p>
                    </TableCell>
                    <TableCell><Badge variant={typeBadgeClass(a.type)}>{a.type}</Badge></TableCell>
                    <TableCell><Badge variant={a.isPublished ? "success" : "default"}>{a.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                    <TableCell className="text-xs uppercase tracking-wider text-text-tertiary">{a.audience}</TableCell>
                    <TableCell className="text-text-tertiary">{formatDateLabel(a.updatedAt ?? a.publishedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditing(a); setForm({ title: a.title, content: a.content, type: a.type, imageUrl: a.imageUrl ?? "", isPublished: a.isPublished, courtId: a.courtId ?? "" }); setOpenFormDialog(true); }}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(a.id)} disabled={deleteMutation.isPending}>Delete</Button>
                      </div>
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
