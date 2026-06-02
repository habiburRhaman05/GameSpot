"use client";

import { motion } from "motion/react";
import { Lock, Zap, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type CheckoutSidebarPanelProps = {
  totalAmount: number;
  loading: boolean;
  isExpired: boolean;
};

const formatMoney = (amount: number) => `USD ${amount.toFixed(2)}`;

export function CheckoutSidebarPanel({ totalAmount, loading, isExpired }: CheckoutSidebarPanelProps) {
  return (
    <aside className="lg:w-[400px]">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="sticky top-28 space-y-8 rounded-2xl border border-border/60 bg-surface-glass backdrop-blur-xl p-8 shadow-xl"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Summary</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">Order Total</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-text-tertiary">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">{formatMoney(totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Payment Method</span>
            <span className="text-text-tertiary">Card</span>
          </div>
          <div className="flex items-center justify-between text-text-tertiary">
            <span>Service Fee</span>
            <span className="font-medium text-foreground">{formatMoney(0)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-label font-semibold uppercase tracking-[0.15em] text-text-tertiary">Total</span>
            <span className="font-display text-4xl font-semibold tracking-tight text-foreground">{formatMoney(totalAmount)}</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || isExpired}
          size="xl"
          className="w-full shadow-lg shadow-primary/20"
        >
          {isExpired ? "Booking Expired" : loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Pay Securely"}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-1.5 rounded-xl bg-primary/5 p-3 text-center">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-[9px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl bg-primary/5 p-3 text-center">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-[9px] font-label font-semibold uppercase tracking-[0.12em] text-text-tertiary">Instant</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
