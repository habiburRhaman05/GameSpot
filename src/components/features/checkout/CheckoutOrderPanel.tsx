import Image from "next/image";
import { motion } from "motion/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Booking } from "@/types/booking.types";

type CheckoutOrderPanelProps = { booking: Booking; isExpired: boolean };

const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const getSlotRange = (booking: Booking) => {
  if (!booking.slots?.length) return "N/A";
  const s = booking.slots.map((s) => s.startMinute);
  const e = booking.slots.map((s) => s.endMinute);
  return `${toTime(Math.min(...s))} – ${toTime(Math.max(...e))}`;
};

export function CheckoutOrderPanel({ booking, isExpired }: CheckoutOrderPanelProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primary/40" />
        <h2 className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Order Summary</h2>
      </div>

      {isExpired && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm font-medium text-destructive">This booking has expired. Please create a new booking.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Venue</p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{booking.court?.name ?? "Selected Court"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Date</p>
              <p className="mt-0.5 font-medium text-foreground">{new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Time</p>
              <p className="mt-0.5 font-medium text-foreground">{getSlotRange(booking)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Booking Code</p>
              <p className="mt-0.5 font-mono font-medium text-foreground">{booking.bookingCode}</p>
            </div>
            <div>
              <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Status</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className={isExpired ? "text-destructive" : "text-text-tertiary"}>
                  {isExpired ? "Expired" : "Pending Payment"}
                </span>
                {!isExpired && <CheckCircle2 className="h-3.5 w-3.5 text-text-tertiary" />}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-48 overflow-hidden rounded-xl bg-muted">
          <Image src="/image2.png" alt={booking.court?.name ?? "Venue"} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute right-3 top-3 rounded-lg bg-primary/90 px-2.5 py-1 text-[10px] font-semibold text-primary-fg shadow-sm backdrop-blur-sm">
            Verified
          </div>
        </div>
      </div>
    </motion.section>
  );
}
