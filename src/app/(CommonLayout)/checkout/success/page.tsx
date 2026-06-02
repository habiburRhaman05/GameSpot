"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock3,
  ReceiptText,
  AlertCircle,
  CreditCard,
  XCircle,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { BookingService } from "@/service/booking.service";
import type { Booking } from "@/types/booking.types";
import Loading from "@/app/loading";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const getStatusLabel = (status?: Booking["status"]) => {
  if (status === "PAID") return "Payment Confirmed";
  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELLED") return "Cancelled";
  return "Pending";
};

const getStatusBadgeVariant = (status?: Booking["status"]) => {
  if (status === "PAID" || status === "COMPLETED") return "success";
  if (status === "CANCELLED") return "error";
  return "warning";
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const data = await BookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        toast.error("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <Loading />;
  }

  if (!bookingId || !booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-10">
        <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 font-display text-3xl font-semibold tracking-tight text-foreground">
          Booking Not Found
        </h1>
        <p className="mb-6 text-sm text-text-tertiary">
          We couldn&apos;t track down the details for this booking.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const isPaid = booking.status === "PAID" || booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";
  const isPending = booking.status === "PENDING";

  return (
    <main className="mx-auto mt-10 w-full max-w-4xl bg-background px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary to-primary-hover px-6 py-10 text-primary-fg sm:px-10 sm:py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fg/15 backdrop-blur-sm"
            >
              {isPaid ? (
                <CheckCircle2 className="h-8 w-8 text-success" />
              ) : isCancelled ? (
                <XCircle className="h-8 w-8 text-destructive" />
              ) : (
                <Clock3 className="h-8 w-8 text-warning" />
              )}
            </motion.div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {isPaid
                  ? "Payment Successful!"
                  : isCancelled
                    ? "Booking Cancelled"
                    : "Payment Pending"}
              </h1>
              <p className="mx-auto max-w-xl text-sm text-primary-fg/70 sm:text-base">
                {isPaid
                  ? "Your booking has been confirmed and payment is completed."
                  : isCancelled
                    ? "This booking has been cancelled and is no longer valid."
                    : "Your booking is reserved, but payment has not been completed yet."}
              </p>
            </div>

            {/* Status Cards */}
            <div className="mt-2 grid w-full max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl border border-primary-fg/15 bg-primary-fg/10 px-4 py-3 text-left backdrop-blur-sm">
                <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-primary-fg/60">
                  Status
                </p>
                <div className="mt-1.5">
                  <Badge variant={getStatusBadgeVariant(booking?.status)} className="text-xs">
                    {getStatusLabel(booking?.status)}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-primary-fg/15 bg-primary-fg/10 px-4 py-3 text-left backdrop-blur-sm">
                <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-primary-fg/60">
                  Booking
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-white">
                  {booking?.bookingCode ?? "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:px-10 sm:py-8 lg:grid-cols-[1fr_2fr]">
          {/* Left Column — QR + Status Note */}
          <div className="flex flex-col gap-4">
            {isPaid && booking && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-2/50 p-5"
              >
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                    Digital Ticket
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" className="w-full gap-2">
                      <ReceiptText className="h-4 w-4" />
                      Show QR Code
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="flex w-[90%] max-w-sm flex-col items-center rounded-2xl border-border bg-card p-6 sm:p-8">
                    <AlertDialogHeader className="w-full space-y-2 text-center">
                      <AlertDialogTitle className="w-full text-center font-display text-2xl font-semibold tracking-tight text-primary">
                        Entry Ticket
                      </AlertDialogTitle>
                      <AlertDialogDescription className="w-full text-center text-sm text-text-tertiary">
                        Please present this QR code to the organizer or host when entering the court.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-6 flex w-fit flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 shadow-inner">
                      <QRCode
                        value={booking.id}
                        size={220}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox="0 0 220 220"
                      />
                    </div>

                    <AlertDialogFooter className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                      <AlertDialogCancel asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Close Ticket
                        </Button>
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <p className="text-[10px] font-label uppercase tracking-wider text-text-tertiary">
                  Required for entry
                </p>
              </motion.div>
            )}

            {/* Status Note */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className={`rounded-xl border p-4 ${
                isPaid
                  ? "border-success/20 bg-success/5"
                  : isPending
                    ? "border-warning/20 bg-warning/5"
                    : "border-destructive/20 bg-destructive/5"
              }`}
            >
              {isPaid ? (
                <p className="text-sm text-success">
                  <span className="font-semibold">Note:</span> Your booking is now
                  confirmed. Any older pending bookings will auto-expire after 24 hours.
                </p>
              ) : isPending ? (
                <p className="text-sm text-warning">
                  <span className="font-semibold">Action Required:</span> Finish your
                  payment to secure this reservation before it expires.
                </p>
              ) : (
                <p className="text-sm text-destructive">
                  <span className="font-semibold">Cancelled:</span> This booking can
                  no longer be paid for or used.
                </p>
              )}
            </motion.div>
          </div>

          {/* Right Column — Booking Details */}
          {booking && (
            <motion.section
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  Booking Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Booking Code" value={booking.bookingCode} mono />
                <DetailItem label="Court" value={booking.court?.name ?? "N/A"} />
                <DetailItem
                  label="Date"
                  value={new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  className="sm:col-span-2"
                />

                {/* Time Slots */}
                <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
                  <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    Time Slots
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.slots?.map((slot) => {
                      const startHour = Math.floor(slot.startMinute / 60);
                      const startMin = slot.startMinute % 60;
                      const endHour = Math.floor(slot.endMinute / 60);
                      const endMin = slot.endMinute % 60;
                      return (
                        <span
                          key={slot.id}
                          className="rounded-lg border border-border bg-primary-soft px-3 py-1.5 font-mono text-xs font-semibold text-primary"
                        >
                          {startHour.toString().padStart(2, "0")}:
                          {startMin.toString().padStart(2, "0")} –{" "}
                          {endHour.toString().padStart(2, "0")}:
                          {endMin.toString().padStart(2, "0")}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <DetailItem
                  label={isPaid ? "Amount Paid" : "Amount Due"}
                  value={`USD ${Number(booking.totalAmount).toFixed(2)}`}
                  className="sm:col-span-2"
                  emphasized
                />
              </div>
            </motion.section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border px-6 py-6 sm:px-10 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              {isPending ? (
                <Button asChild>
                  <Link href={`/checkout?bookingId=${booking.id}`} className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Complete Payment
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/dashboard/bookings" className="gap-2">
                    <ReceiptText className="h-4 w-4" />
                    View My Bookings
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {isPaid && (
            <p className="mt-4 text-center text-xs text-text-tertiary">
              A confirmation email has been sent to your registered address.
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  );
}

function DetailItem({
  label,
  value,
  className,
  mono = false,
  emphasized = false,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div className={className}>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[10px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-semibold text-foreground ${mono ? "font-mono" : ""} ${emphasized ? "font-display text-lg text-primary" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
