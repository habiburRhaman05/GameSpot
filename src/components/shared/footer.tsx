"use client";

import Link from "next/link";
<<<<<<< Updated upstream
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
=======
import {
  ArrowUpRight,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Activity,
  Trophy,
} from "lucide-react";
>>>>>>> Stashed changes

type LinkItem = { label: string; href: string };

const navigationLinks: LinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Organizers", href: "/organizers" },
  { label: "Venues", href: "/venues" },
  { label: "Member Perks", href: "/" },
];

const supportLinks: LinkItem[] = [
  { label: "Global Concierge", href: "/" },
  { label: "Booking FAQ", href: "/" },
  { label: "Safety Protocols", href: "/" },
  { label: "Account Access", href: "/" },
];

const communityLinks: LinkItem[] = [
  { label: "Athlete Forum", href: "/forum" },
  { label: "Partner with Us", href: "/dashboard/become-organizer" },
  { label: "Founders Circle", href: "/founders" },
  { label: "Press Inquiries", href: "/press" },
];

const socialLinks: LinkItem[] = [
  { label: "IG", href: "/" },
  { label: "TW", href: "/" },
  { label: "LI", href: "/" },
  { label: "YT", href: "/" },
];

function FooterColumn({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <div className="space-y-3.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
        {title}
      </p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary transition-colors duration-150 hover:text-foreground inline-block"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
<<<<<<< Updated upstream
    <footer className="w-full border-t border-border bg-card md:max-w-7xl md:mb-8 md:rounded-2xl md:mx-auto">
      <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="space-y-4">
            <h2 className="font-display text-4xl font-black uppercase leading-[0.88] tracking-tight text-gradient-aurora sm:text-6xl lg:text-7xl">
              <span className="block">Court</span>
              <span className="block">Connect</span>
            </h2>
            <div className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">
                Member of the SKILLEX Network
=======
    <footer className="relative mx-auto w-full overflow-hidden border-t border-border bg-surface md:mt-12 md:max-w-7xl md:rounded-3xl md:border md:bg-card md:shadow-xl">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-accent/6 blur-3xl" />
      </div>

      {/* Stat strip */}
      <div className="relative border-b border-border/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-5 py-8 sm:grid-cols-4 sm:px-8 sm:py-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-display text-2xl font-black tracking-tight text-gradient-aurora sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-text-tertiary">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-12 sm:px-8 lg:px-10">
        {/* Brand identity section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Logo + brand story */}
          <div className="max-w-sm space-y-4">
            <Logo variant="default" hideTagline />
            <h2 className="font-display text-3xl font-black uppercase leading-[0.92] tracking-tight sm:text-4xl">
              <span className="block text-foreground">Built for the</span>
              <span className="block text-gradient-aurora">players.</span>
            </h2>
            <p className="text-[13.5px] leading-relaxed text-text-secondary">
              Discover premium courts, book in seconds, and play with elite communities — all in
              one app trusted by athletes worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-accent">
                <Activity className="h-2.5 w-2.5" strokeWidth={2.6} />
                Live now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-tertiary">
                <Trophy className="h-2.5 w-2.5" strokeWidth={2.6} />
                Premium club
>>>>>>> Stashed changes
              </span>
            </div>
          </div>

<<<<<<< Updated upstream
          <div className="space-y-4">
            <p className="max-w-sm text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary sm:text-xs">
              Subscribe to the journal for elite scouting reports and private
              venue drops.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-2"
            >
              <div className="flex items-end gap-2 border-b border-border pb-2 group focus-within:border-primary transition-colors duration-150">
                <input
                  type="email"
                  placeholder="YOUR@EMAIL.COM"
                  className="h-10 w-full bg-transparent font-display text-xl font-black uppercase tracking-tight text-foreground outline-none placeholder:text-text-tertiary sm:text-3xl lg:text-4xl"
                />
                <button
                  type="submit"
                  className="mb-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-150 hover:bg-primary-hover active:scale-95"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-text-tertiary">
                No spam. Premium venue insights only.
              </p>
            </form>
=======
          {/* Right: Social + Download */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10 lg:flex-col lg:items-end">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-tertiary">
                Follow us
              </p>
              <div className="flex flex-wrap gap-1.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className={cn(
                      "group/social inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/60 text-text-secondary",
                      "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_8px_20px_-8px_rgba(0,102,255,0.5)]",
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-200 group-hover/social:scale-110" strokeWidth={2} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 px-4 py-3">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-text-tertiary">
                Download
              </p>
              <p className="mt-1 text-[12px] font-semibold text-foreground">
                iOS & Android — coming soon
              </p>
            </div>
>>>>>>> Stashed changes
          </div>
        </div>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Navigation" items={navigationLinks} />
          <FooterColumn title="Support" items={supportLinks} />
          <FooterColumn title="Community" items={communityLinks} />

<<<<<<< Updated upstream
          <div className="space-y-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
              Social Connection
            </p>
            <div className="flex flex-wrap gap-1.5">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-surface-2/50 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary transition-all duration-150 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
=======
          {/* Quick CTA column */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-tertiary">
              Get started
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/signup"
                  className="group/flink inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-200 hover:text-foreground"
                >
                  <span className="relative">
                    Create account
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/flink:scale-x-100"
                    />
                  </span>
                  <ArrowUpRight
                    className="h-3 w-3 -translate-x-0.5 -translate-y-px opacity-0 transition-all duration-200 group-hover/flink:translate-x-0 group-hover/flink:translate-y-0 group-hover/flink:opacity-100"
                    strokeWidth={2.2}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/venues"
                  className="group/flink inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-200 hover:text-foreground"
                >
                  <span className="relative">
                    Browse venues
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/flink:scale-x-100"
                    />
                  </span>
                  <ArrowUpRight
                    className="h-3 w-3 -translate-x-0.5 -translate-y-px opacity-0 transition-all duration-200 group-hover/flink:translate-x-0 group-hover/flink:translate-y-0 group-hover/flink:opacity-100"
                    strokeWidth={2.2}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/become-organizer"
                  className="group/flink inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-200 hover:text-foreground"
                >
                  <span className="relative">
                    List your venue
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/flink:scale-x-100"
                    />
                  </span>
                  <ArrowUpRight
                    className="h-3 w-3 -translate-x-0.5 -translate-y-px opacity-0 transition-all duration-200 group-hover/flink:translate-x-0 group-hover/flink:translate-y-0 group-hover/flink:opacity-100"
                    strokeWidth={2.2}
                  />
                </Link>
              </li>
            </ul>
>>>>>>> Stashed changes
          </div>
        </div>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.16em] text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 GameSpot Network. Built for players.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-150">
              Privacy Charter
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-150">
              Terms of Presence
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors duration-150">
              Cookie Integrity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
