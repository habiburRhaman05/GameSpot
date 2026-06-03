"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Mail,
  ArrowRight,
  Check,
  Zap,
  Trophy,
  Star,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";

/* ==========================================================================
   Newsletter — premium full-width CTA section
   ========================================================================== */
export function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const badge = sectionRef.current.querySelector(".nl-badge");
      const heading = sectionRef.current.querySelector(".nl-heading");
      const sub = sectionRef.current.querySelector(".nl-sub");
      const form = sectionRef.current.querySelector(".nl-form");
      const perks = sectionRef.current.querySelectorAll(".nl-perk");
      const glow = sectionRef.current.querySelector(".nl-glow");
      const decor = sectionRef.current.querySelectorAll(".nl-decor");

      if (badge) {
        gsap.fromTo(
          badge,
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: "back.out(1.7)" },
        );
      }

      if (heading) {
        gsap.fromTo(
          heading,
          { y: 30, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, delay: 0.2, ease: "power3.out" },
        );
      }

      if (sub) {
        gsap.fromTo(
          sub,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.35, ease: "power3.out" },
        );
      }

      if (form) {
        gsap.fromTo(
          form,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: "power3.out" },
        );
      }

      if (perks.length) {
        gsap.fromTo(
          perks,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.7, ease: "power3.out" },
        );
      }

      if (glow) {
        gsap.to(glow, {
          scale: 1.15,
          opacity: 0.5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (decor.length) {
        decor.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -8 : 8,
            rotation: i % 2 === 0 ? 5 : -5,
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }
    },
    { scope: sectionRef },
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-border/60 bg-gradient-to-br from-background via-background to-primary/[0.03]"
    >
      {/* ── Ambient glow ── */}
      <div
        className="nl-glow pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,102,255,0.15) 0%, rgba(0,210,106,0.08) 40%, transparent 70%)",
        }}
      />

      {/* ── Decorative floating elements ── */}
      <div className="nl-decor pointer-events-none absolute left-[8%] top-[15%] h-10 w-10 rounded-xl border border-primary/[0.06] bg-primary/[0.03]" />
      <div className="nl-decor pointer-events-none absolute right-[10%] top-[20%] h-7 w-7 rounded-lg border border-accent/[0.06] bg-accent/[0.03]" />
      <div className="nl-decor pointer-events-none absolute bottom-[20%] left-[12%] h-6 w-6 rounded-full border border-tertiary/[0.06] bg-tertiary/[0.03]" />
      <div className="nl-decor pointer-events-none absolute bottom-[15%] right-[8%] h-8 w-8 rounded-xl border border-primary/[0.06] bg-primary/[0.03] rotate-12" />

      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col items-center text-center">
          {/* ── Badge ── */}
          <div className="nl-badge mb-5 inline-flex items-center gap-2 rounded-full border border-primary/[0.12] bg-primary/[0.06] px-3.5 py-1.5 backdrop-blur-sm">
            <Mail className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
            <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-primary">
              The Locker Room
            </span>
          </div>

          {/* ── Heading ── */}
          <h2 className="nl-heading font-display text-[clamp(1.8rem,4.5vw,3.2rem)] font-black uppercase leading-[0.92] tracking-tight">
            <span className="block text-foreground">Don&apos;t miss a</span>
            <span className="block text-gradient-aurora">single play.</span>
          </h2>

          {/* ── Subtitle ── */}
          <p className="nl-sub mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-text-secondary sm:text-[14.5px]">
            Get weekly drops on premium venues, exclusive coaching tips, member-only
            tournaments, and insider deals — straight to your inbox.
          </p>

          {/* ── Form ── */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="nl-form mt-8 w-full max-w-md"
            >
              <div className="flex items-stretch gap-2 rounded-2xl border border-border-strong/60 bg-surface/80 p-1.5 shadow-lg transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_var(--primary-soft)] focus-within:shadow-primary/10">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 w-full bg-transparent px-4 text-sm font-medium text-foreground outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  className="group/sub inline-flex h-11 items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_4px_14px_-4px_rgba(0,102,255,0.45)] transition-all duration-200 hover:shadow-[0_6px_20px_-4px_rgba(0,102,255,0.55)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Subscribe
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5"
                    strokeWidth={2.4}
                  />
                </button>
              </div>
              <p className="mt-2.5 text-[10.5px] text-text-tertiary">
                No spam. Unsubscribe anytime.{" "}
                <span className="font-medium text-text-secondary">
                  Join 12,000+ athletes.
                </span>
              </p>
            </form>
          ) : (
            <div className="nl-form mt-8 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.06] px-6 py-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Check className="h-4 w-4 text-accent" strokeWidth={2.6} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">You&apos;re in!</p>
                <p className="text-[11.5px] text-text-secondary">
                  Welcome to The Locker Room. Check your inbox.
                </p>
              </div>
            </div>
          )}

          {/* ── Perks ── */}
          <div className="nl-perk mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: Zap, label: "Early access to courts", color: "text-primary" },
              { icon: Trophy, label: "Member tournaments", color: "text-tertiary" },
              { icon: Star, label: "Exclusive deals", color: "text-accent" },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-secondary"
              >
                <Icon className={cn("h-3 w-3", color)} strokeWidth={2.4} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
