"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "motion/react";
import { AlertCircle, RefreshCcw } from "lucide-react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckoutPaymentContent } from "@/components/features/checkout/CheckoutPaymentContent";
import { BookingService } from "@/service/booking.service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const initRef = useRef(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [paymentInitError, setPaymentInitError] = useState<string | null>(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (!bookingId) {
      router.push("/");
    }
  }, [bookingId, router]);

  useEffect(() => {
    if (!bookingId) return;

    const initializePayment = async () => {
      try {
        setInitializingPayment(true);
        setPaymentInitError(null);
        const paymentData = await BookingService.initiatePayment({ bookingId });
        setClientSecret(paymentData.clientSecret);
      } catch (err) {
        setPaymentInitError(
          err instanceof Error ? err.message : "Failed to initialize payment",
        );
      } finally {
        setInitializingPayment(false);
      }
    };

    initializePayment();
  }, [bookingId]);

  if (!bookingId) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-24 md:px-12">
      <div className="mx-auto max-w-375">
        {initializingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-80 items-center justify-center"
          >
            <LoadingSpinner label="Preparing checkout..." />
          </motion.div>
        )}

        {paymentInitError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl rounded-xl border border-destructive/30 bg-destructive/5 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="space-y-3">
                <p className="text-sm font-medium text-destructive">
                  {paymentInitError}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Try Again
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {!initializingPayment && !paymentInitError && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#5B5BF5",
                  colorPrimaryText: "#FFFFFF",
                  colorBackground: "#FFFFFF",
                  colorText: "#0F1020",
                  colorDanger: "#EF4444",
                  fontFamily:
                    '"Inter", ui-sans-serif, system-ui, sans-serif',
                  borderRadius: "10px",
                  spacingUnit: "4px",
                },
                rules: {
                  ".Input": {
                    border: "1px solid #E5E5EE",
                    boxShadow: "none",
                    fontSize: "14px",
                    padding: "12px",
                    transition: "border-color 200ms ease, box-shadow 200ms ease",
                  },
                  ".Input:focus": {
                    border: "1px solid #5B5BF5",
                    boxShadow: "0 0 0 3px rgba(91, 91, 245, 0.15)",
                  },
                  ".Label": {
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#5A5C72",
                    marginBottom: "4px",
                  },
                  ".Tab": {
                    border: "1px solid #E5E5EE",
                    borderRadius: "10px",
                    padding: "10px 16px",
                  },
                  ".Tab--selected": {
                    borderColor: "#5B5BF5",
                    boxShadow: "0 0 0 1px #5B5BF5",
                  },
                },
              },
            }}
          >
            <CheckoutPaymentContent bookingId={bookingId} />
          </Elements>
        )}
      </div>
    </main>
  );
}
