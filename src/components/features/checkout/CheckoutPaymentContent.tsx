"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import { Info, ShieldCheck } from "lucide-react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BookingService } from "@/service/booking.service";
import type { Booking } from "@/types/booking.types";
import { CheckoutOrderPanel } from "./CheckoutOrderPanel";
import { CheckoutSidebarPanel } from "./CheckoutSidebarPanel";

const hasExpired = (expiresAt?: string | null) => expiresAt ? new Date(expiresAt).getTime() <= Date.now() : false;

export function CheckoutPaymentContent({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try { setLoadingBooking(true); setError(null); const data = await BookingService.getBookingById(bookingId); setBooking(data); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed to load booking"); }
      finally { setLoadingBooking(false); }
    };
    load();
  }, [bookingId]);

  const isExpired = useMemo(() => hasExpired(booking?.expiresAt), [booking?.expiresAt]);
  const totalAmount = useMemo(() => Number(booking?.totalAmount ?? 0), [booking?.totalAmount]);

  const onPayNow = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || isExpired) return;
    setSubmitting(true);
    setError(null);
    try {
      const latest = await BookingService.getBookingById(bookingId);
      setBooking(latest);
      if (hasExpired(latest.expiresAt)) { setError("This booking has expired."); return; }
      const { error: submitError } = await elements.submit();
      if (submitError) { setError(submitError.message ?? "Unable to submit"); return; }
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/checkout/success?bookingId=${bookingId}` },
      });
      if (confirmError) setError(confirmError.message ?? "Payment failed");
    } catch (err) { setError(err instanceof Error ? err.message : "Unexpected error"); }
    finally { setSubmitting(false); }
  };

  if (loadingBooking) return <div className="flex items-center justify-center py-20"><LoadingSpinner label="Loading checkout..." /></div>;
  if (!booking) return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Booking not found.</div>;

  return (
    <form onSubmit={onPayNow} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="space-y-1">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">Checkout</h1>
          <p className="text-sm text-text-tertiary">Finalize your booking.</p>
        </div>

        <CheckoutOrderPanel booking={booking} isExpired={isExpired} />

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-primary/40" />
            <h2 className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Payment</h2>
          </div>

          <div className="flex items-center justify-between rounded-xl border-2 border-primary bg-card px-5 py-4">
            <span className="font-label text-sm font-semibold tracking-wider text-foreground">Card Payment</span>
            <div className="h-4 w-4 rounded-full border-[3px] border-primary bg-primary" />
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Test Mode</p>
                <p className="mt-1 text-text-tertiary">
                  Use card <span className="font-mono font-semibold select-all">4242 4242 4242 4242</span> with any future date and CVC.
                </p>
              </div>
            </div>

            <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Card Details</p>
            {isExpired ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Booking expired. Cannot checkout.</div>
            ) : (
              <div className="[&_.StripeElement]:rounded-lg [&_.StripeElement]:border [&_.StripeElement]:border-border [&_.StripeElement]:p-3">
                <PaymentElement />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secured by Stripe · Your payment info is encrypted.
          </div>
        </div>

        {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      </motion.div>

      <CheckoutSidebarPanel totalAmount={totalAmount} loading={submitting} isExpired={isExpired} />
    </form>
  );
}
