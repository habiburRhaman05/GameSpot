"use client";

import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Reveal } from "@/components/shared/Reveal";

export function DiscountSection() {
  const [copied, setCopied] = useState(false);
  const couponCode = "WELCOME10";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/95 py-20 lg:py-32 px-6 sm:px-8 lg:px-12">
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Left Column */}
        <Reveal variant="slideLeft" delay={0.1}>
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
            <span className="inline-flex rounded-lg bg-accent/20 px-3 py-1 font-bold uppercase tracking-widest text-[10.5px] text-accent sm:text-xs">
              Exclusive Welcome Gift
            </span>

            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9]">
              <span className="block text-primary-foreground">The</span>
              <span className="block text-primary-foreground mt-1">Arena Is</span>
              <span className="block text-primary-foreground mt-1">Yours.</span>
              <span className="block text-accent mt-2">Start</span>
              <span className="block text-accent mt-1">With</span>
              <span className="block text-accent mt-1">10% Off.</span>
            </h2>

            <p className="text-primary-foreground/80 max-w-md text-sm sm:text-base leading-relaxed pt-2">
              Every champion needs a home court. We&apos;re welcoming you to the elite
              roster with an exclusive discount on your first professional-grade
              booking.
            </p>
          </div>
        </Reveal>

        {/* Right Column */}
        <Reveal variant="slideRight" delay={0.2}>
          <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
            {/* Coupon Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative rounded-2xl glass p-8 sm:p-10 md:p-12 shadow-2xl border border-accent/20"
            >
              <div className="flex flex-col items-center justify-center text-center gap-6">
                <p className="text-[10px] sm:text-[11px] text-accent font-black uppercase tracking-[0.25em]">
                  Use code at checkout
                </p>

                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="font-display text-4xl sm:text-5xl md:text-[4rem] font-black text-accent tracking-tight">
                    {couponCode}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="rounded-xl bg-accent/15 hover:bg-accent/25 p-3 sm:p-4 transition-colors shrink-0 group flex items-center justify-center border border-accent/30"
                    aria-label="Copy coupon code"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    ) : (
                      <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:scale-110 transition-transform" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-6 flex justify-center lg:justify-start"
            >
              <button className="group inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 sm:py-5 font-black uppercase text-xs sm:text-sm tracking-[0.2em] text-accent-fg transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]">
                Claim Your Discount
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
