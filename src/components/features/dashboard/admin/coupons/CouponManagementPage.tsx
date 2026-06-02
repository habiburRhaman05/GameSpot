"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TicketPercent, Percent, WalletCards } from "lucide-react";
import { toast } from "sonner";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { couponService } from "@/service/coupon.service";
import type { CreateCouponPayload, Coupon, CouponDiscountType, UpdateCouponPayload } from "@/types/coupon.types";

type FilterMode = "ALL" | "ACTIVE" | "INACTIVE";

type CouponFormState = {
  code: string;
  discountType: CouponDiscountType;
  discountValue: string;
  minBookingAmount: string;
  maxDiscountAmount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
};

const defaultFormState: CouponFormState = {
  code: "", discountType: "PERCENTAGE", discountValue: "", minBookingAmount: "",
  maxDiscountAmount: "", usageLimit: "", expiresAt: "", isActive: true,
};

const toDateTimeLocalValue = (value: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}T${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
};

const toFormStateFromCoupon = (coupon: Coupon): CouponFormState => ({
  code: coupon.code,
  discountType: coupon.discountType,
  discountValue: String(coupon.discountValue ?? ""),
  minBookingAmount: coupon.minBookingAmount === null ? "" : String(coupon.minBookingAmount),
  maxDiscountAmount: coupon.maxDiscountAmount === null ? "" : String(coupon.maxDiscountAmount),
  usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
  expiresAt: toDateTimeLocalValue(coupon.expiresAt),
  isActive: coupon.isActive,
});

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDateLabel = (value: string | null) => {
  if (!value) return "Never";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Invalid date" : format(parsed, "MMM dd, yyyy");
};

const formatDiscountLabel = (type: CouponDiscountType, dv: string | number, max: string | number | null) => {
  const value = Number(dv ?? 0);
  if (type === "PERCENTAGE") {
    const m = max === null ? null : Number(max ?? 0);
    return m && m > 0 ? `${value}% (max USD ${m})` : `${value}%`;
  }
  return `USD ${value}`;
};

export default function CouponManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormState>(defaultFormState);

  const couponsQuery = useQuery({
    queryKey: ["admin-coupons", search],
    queryFn: () => couponService.getAdminCoupons({ page: 1, limit: 200, sortBy: "-createdAt", searchTerm: search.trim() || undefined }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const coupons = useMemo(() => couponsQuery.data?.data ?? [], [couponsQuery.data?.data]);
  const rows = useMemo(() => {
    if (filterMode === "ACTIVE") return coupons.filter((c) => c.isActive);
    if (filterMode === "INACTIVE") return coupons.filter((c) => !c.isActive);
    return coupons;
  }, [coupons, filterMode]);

  const activeCount = coupons.filter((c) => c.isActive).length;
  const percentageCount = coupons.filter((c) => c.discountType === "PERCENTAGE").length;

  const createCouponMutation = useMutation({
    mutationFn: (payload: CreateCouponPayload) => couponService.createCoupon(payload),
    onSuccess: async () => {
      toast.success("Coupon created");
      setOpenFormDialog(false); setEditingCoupon(null); setForm(defaultFormState);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to create coupon"),
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ couponId, payload }: { couponId: string; payload: UpdateCouponPayload }) => couponService.updateCoupon(couponId, payload),
    onSuccess: async () => {
      toast.success("Coupon updated");
      setOpenFormDialog(false); setEditingCoupon(null); setForm(defaultFormState);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update coupon"),
  });

  const toggleCouponStatusMutation = useMutation({
    mutationFn: ({ couponId, isActive }: { couponId: string; isActive: boolean }) => couponService.updateCoupon(couponId, { isActive }),
    onSuccess: async (_result, vars) => {
      toast.success(vars.isActive ? "Coupon activated" : "Coupon deactivated");
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update coupon"),
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (couponId: string) => couponService.deleteCoupon(couponId),
    onSuccess: async () => {
      toast.success("Coupon deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete coupon"),
  });

  const handleSubmitCoupon = () => {
    const code = form.code.trim().toUpperCase();
    const discountValue = toNumber(form.discountValue);
    if (!code || !discountValue || discountValue <= 0) {
      toast.error("Coupon code and a positive discount value are required");
      return;
    }

    const basePayload = { code, discountType: form.discountType, discountValue, isActive: form.isActive } as any;
    const minBA = toNumber(form.minBookingAmount);
    if (minBA !== undefined) basePayload.minBookingAmount = minBA;
    const ul = toNumber(form.usageLimit);
    if (ul !== undefined) basePayload.usageLimit = ul;
    if (form.discountType === "PERCENTAGE") {
      const mda = toNumber(form.maxDiscountAmount);
      if (mda !== undefined) basePayload.maxDiscountAmount = mda;
    }
    if (form.expiresAt) basePayload.expiresAt = new Date(form.expiresAt).toISOString();

    if (editingCoupon) {
      updateCouponMutation.mutate({ couponId: editingCoupon.id, payload: basePayload });
    } else {
      createCouponMutation.mutate(basePayload as CreateCouponPayload);
    }
  };

  if (couponsQuery.isPending) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Coupon Management</h1>
        <p className="text-sm text-text-tertiary">Create and control promotional coupons for bookings.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard label="Total Coupons" value={coupons.length} icon={TicketPercent} subtitle="All coupon codes" />
        <DashboardStatCard label="Active" value={activeCount} icon={WalletCards} subtitle="Currently eligible" />
        <DashboardStatCard label="Percentage" value={percentageCount} icon={Percent} subtitle="Percent-based discount" accent />
      </div>

      <Card className="rounded-xl border border-border bg-card">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-label text-base font-semibold text-foreground">Coupons</CardTitle>
            <Dialog open={openFormDialog} onOpenChange={(next) => { setOpenFormDialog(next); if (!next) { setEditingCoupon(null); setForm(defaultFormState); }}}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingCoupon(null); setForm(defaultFormState); }}>Add Coupon</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                  </DialogTitle>
                  <DialogDescription>Configure discount details, expiry and usage control.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Coupon Code</Label><Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="WELCOME10" /></div>
                  <div className="space-y-2"><Label>Discount Type</Label>
                    <select value={form.discountType} onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as CouponDiscountType }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                      <option value="PERCENTAGE">PERCENTAGE</option><option value="FIXED">FIXED</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>Discount Value</Label><Input type="number" min={0} step="0.01" value={form.discountValue} onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))} placeholder={form.discountType === "PERCENTAGE" ? "10" : "50"} /></div>
                  <div className="space-y-2"><Label>Min Booking Amount</Label><Input type="number" min={0} step="0.01" value={form.minBookingAmount} onChange={(e) => setForm((p) => ({ ...p, minBookingAmount: e.target.value }))} placeholder="Optional" /></div>
                  <div className="space-y-2"><Label>Usage Limit</Label><Input type="number" min={1} step="1" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} placeholder="Optional" /></div>
                  <div className="space-y-2"><Label>Expires At</Label><Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} /></div>
                  {form.discountType === "PERCENTAGE" && (
                    <div className="space-y-2"><Label>Max Discount Amount</Label><Input type="number" min={0} step="0.01" value={form.maxDiscountAmount} onChange={(e) => setForm((p) => ({ ...p, maxDiscountAmount: e.target.value }))} placeholder="Optional" /></div>
                  )}
                  <label className="flex items-center gap-2 text-sm font-medium md:col-span-2">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                    Activate immediately
                  </label>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setOpenFormDialog(false); setEditingCoupon(null); setForm(defaultFormState); }}>Cancel</Button>
                  <Button onClick={handleSubmitCoupon} disabled={createCouponMutation.isPending || updateCouponMutation.isPending}>
                    {editingCoupon ? "Update" : "Create"} Coupon
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map((key) => (
                <Button key={key} type="button" variant={filterMode === key ? "default" : "outline"} size="sm" onClick={() => setFilterMode(key)}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coupon code..." className="h-9 w-full md:w-72" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Usage</TableHead><TableHead>Min Amount</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center text-text-tertiary">No coupons found.</TableCell></TableRow>
                )}
                {rows.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-semibold text-foreground">{coupon.code}</TableCell>
                    <TableCell className="text-text-tertiary">{formatDiscountLabel(coupon.discountType, coupon.discountValue, coupon.maxDiscountAmount)}</TableCell>
                    <TableCell className="text-text-tertiary">{coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}</TableCell>
                    <TableCell className="text-text-tertiary">{coupon.minBookingAmount === null ? "—" : `USD ${Number(coupon.minBookingAmount)}`}</TableCell>
                    <TableCell className="text-text-tertiary">{formatDateLabel(coupon.expiresAt)}</TableCell>
                    <TableCell><Badge variant={coupon.isActive ? "success" : "default"}>{coupon.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingCoupon(coupon); setForm(toFormStateFromCoupon(coupon)); setOpenFormDialog(true); }}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => toggleCouponStatusMutation.mutate({ couponId: coupon.id, isActive: !coupon.isActive })} disabled={toggleCouponStatusMutation.isPending}>
                          {coupon.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCouponMutation.mutate(coupon.id)} disabled={deleteCouponMutation.isPending}>Delete</Button>
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
