"use client";
"use no memo";

import { useMemo, useState } from "react";
import Image from "next/image";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, SlidersHorizontal, CheckCircle2, Clock3, CalendarClock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AVATAR_FALLBACK_IMAGE, VENUE_FALLBACK_IMAGE, getInitials } from "@/lib/placeholders";
import type { Booking } from "@/types/booking.types";

export type BookingActorRole = "USER" | "ORGANIZER" | "ADMIN";
type BookingTab = "UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED";

type UniversalBookingTableProps = {
  role: BookingActorRole;
  bookings: Booking[];
  loading?: boolean;
  onView?: (booking: Booking) => void;
  onPay?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onApprove?: (booking: Booking) => void;
  onReject?: (booking: Booking) => void;
  heading?: string;
};

const statusBadge = (status: Booking["status"]) => {
  if (status === "PAID") return "success";
  if (status === "PENDING") return "warning";
  if (status === "COMPLETED") return "info";
  return "destructive";
};

const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const getTimeRange = (booking: Booking) => {
  if (!booking.slots?.length) return "--:-- – --:--";
  const starts = booking.slots.map((s) => s.startMinute);
  const ends = booking.slots.map((s) => s.endMinute);
  return `${toTime(Math.min(...starts))} – ${toTime(Math.max(...ends))}`;
};

const isUpcoming = (booking: Booking) => {
  const d = new Date(booking.bookingDate);
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return d >= t && ["PENDING", "PAID"].includes(booking.status);
};

const getVenueName = (booking: Booking) => booking.court?.name?.trim() || `Court ${booking.courtId.slice(0, 6)}`;
const getVenueImage = (booking: Booking) => booking.court?.media?.find((m) => m.isPrimary)?.url ?? booking.court?.media?.[0]?.url ?? VENUE_FALLBACK_IMAGE;

export function UniversalBookingTable({ role, bookings, loading, onView, onPay, onCancel, onApprove, onReject, heading = "Booking Management" }: UniversalBookingTableProps) {
  const [activeTab, setActiveTab] = useState<BookingTab>("UPCOMING");
  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    const tabFiltered = bookings.filter((b) => {
      if (activeTab === "UPCOMING") return isUpcoming(b);
      if (activeTab === "PENDING") return b.status === "PENDING";
      if (activeTab === "COMPLETED") return b.status === "COMPLETED";
      return b.status === "CANCELLED";
    });
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter((b) => [b.user?.name, b.user?.email, getVenueName(b), b.bookingCode].some((f) => f?.toLowerCase().includes(q)));
  }, [activeTab, bookings, search]);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const activeCount = bookings.filter((b) => b.status === "PAID").length;
  const completionRate = bookings.length === 0 ? 0 : Math.round((bookings.filter((b) => b.status === "COMPLETED").length / bookings.length) * 100);

  const columns = useMemo<ColumnDef<Booking>[]>(() => [
    { id: "user", header: "Athlete", cell: ({ row }) => { const b = row.original; return (
      <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 rounded-lg"><AvatarImage src={b.user?.avatarUrl ?? AVATAR_FALLBACK_IMAGE} alt={b.user?.name ?? "Athlete"} /><AvatarFallback className="rounded-lg bg-primary/10 text-[10px] text-primary">{getInitials(b.user?.name ?? "Guest")}</AvatarFallback></Avatar>
        <div><p className="text-sm font-medium text-foreground">{b.user?.name ?? "Guest"}</p><p className="text-xs text-text-tertiary">{b.user?.email ?? ""}</p></div>
      </div>
    );}},
    { id: "venue", header: "Venue", cell: ({ row }) => { const b = row.original; return (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60">
          <Image src={getVenueImage(b)} alt={getVenueName(b)} fill className="object-cover" sizes="56px" />
        </div>
        <div><p className="text-sm font-medium text-foreground">{getVenueName(b)}</p><p className="text-xs text-text-tertiary font-mono">{b.bookingCode}</p></div>
      </div>
    );}},
    { id: "date", header: "Date & Time", cell: ({ row }) => { const b = row.original; return (
      <div><p className="text-sm font-medium text-foreground">{format(new Date(b.bookingDate), "MMM dd, yyyy")}</p><p className="text-xs text-text-tertiary">{getTimeRange(b)}</p></div>
    );}},
    { id: "payment", header: "Payment", cell: ({ row }) => <Badge variant={statusBadge(row.original.status) as any}>{row.original.status}</Badge> },
    { id: "actions", header: "Actions", cell: ({ row }) => { const b = row.original; const isPending = b.status === "PENDING"; return (
      <div className="flex flex-wrap gap-2">
        {onView && <Button size="sm" variant="outline" onClick={() => onView(b)}><Eye className="mr-1 h-3.5 w-3.5" />View</Button>}
        {role === "USER" && isPending && onPay && <Button size="sm" onClick={() => onPay(b)}>Pay</Button>}
        {role === "ORGANIZER" && isPending && onApprove && <Button size="sm" variant="default" onClick={() => onApprove(b)}>Approve</Button>}
        {role === "ORGANIZER" && isPending && onReject && <Button size="sm" variant="destructive" onClick={() => onReject(b)}>Reject</Button>}
        {role !== "ADMIN" && onCancel && ["PENDING", "PAID"].includes(b.status) && <Button size="sm" variant="outline" onClick={() => onCancel(b)}>Cancel</Button>}
      </div>
    );}},
  ], [onView, onPay, onCancel, onApprove, onReject, role]);

  const table = useReactTable({ data: filteredBookings, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: 10 } } });
  const pageRows = table.getRowModel().rows;
  const rowStart = filteredBookings.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const rowEnd = Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredBookings.length);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{heading}</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardStatCard label="Pending Approvals" value={pendingCount} icon={Clock3} subtitle="Awaiting confirmation" />
        <DashboardStatCard label="Active Reservations" value={activeCount} icon={CalendarClock} subtitle="Paid & active" />
        <DashboardStatCard label="Historical Total" value={bookings.length} icon={CheckCircle2} subtitle={`${completionRate}% completion`} accent />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingTab)}>
            <TabsList className="bg-transparent -mx-1">
              {(["UPCOMING", "PENDING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
                <TabsTrigger key={tab} value={tab} className="px-3 text-sm font-medium">{tab.charAt(0) + tab.slice(1).toLowerCase()}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search athlete, venue or code..." className="h-9 w-56" />
            <Button variant="outline" size="sm" className="gap-1.5"><SlidersHorizontal className="h-3.5 w-3.5" />Filter</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>{table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>{hg.headers.map((h) => (
                <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
              ))}</TableRow>
            ))}</TableHeader>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={columns.length} className="py-12 text-center"><LoadingSpinner label="Loading bookings..." className="justify-center" /></TableCell></TableRow>}
              {!loading && pageRows.length === 0 && <TableRow><TableCell colSpan={columns.length} className="py-12 text-center text-text-tertiary">No bookings found.</TableCell></TableRow>}
              {!loading && pageRows.map((row) => (
                <TableRow key={row.id}>{row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 text-xs text-text-tertiary md:flex-row md:items-center md:justify-between">
          <p className="font-label uppercase tracking-wider">Showing {rowStart}–{rowEnd} of {filteredBookings.length}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
            <Button variant="default" size="sm" className="min-w-[40px]">{String(table.getState().pagination.pageIndex + 1).padStart(2, "0")}</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
