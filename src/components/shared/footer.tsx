"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Activity,
  Trophy,
  Mail,
} from "lucide-react";

import { Logo } from "./logo";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Footer link data
   ========================================================================== */
type LinkItem = { label: string; href: string };

const navigationLinks: LinkItem[] = [
  { label: "Discover Venues", href: "/venues" },
  { label: "Top Organizers", href: "/organizers" },
  { label: "About Us", href: "/about" },
  { label: "Live Scores", href: "/" },
];

const supportLinks: LinkItem[] = [
  { label: "Help Center", href: "/" },
  { label: "Booking Guide", href: "/" },
  { label: "Safety Guidelines", href: "/" },
  { label: "Contact Support", href: "/" },
];

const communityLinks: LinkItem[] = [
  { label: "Athlete Community", href: "/" },
  { label: "Become an Organizer", href: "/dashboard/become-organizer" },
  { label: "Partner Program", href: "/" },
  { label: "Press & Media", href: "/" },
];

const socialLinks = [
  { label: "Instagram", href: "/", Icon: Instagram },
  { label: "Twitter / X", href: "/", Icon: Twitter },
  { label: "LinkedIn", href: "/", Icon: Linkedin },
  { label: "YouTube", href: "/", Icon: Youtube },
] as const;

const stats = [
  { label: "Venues", value: "2,400+" },
  { label: "Cities", value: "120" },
  { label: "Sports", value: "18" },
  { label: "Athletes", value: "85K" },
];

/* ==========================================================================
   Footer column
   ========================================================================== */
function FooterColumn({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-tertiary">
        {title}
      </p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group/flink inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-200 hover:text-foreground"
            >
              <span className="relative">
                {item.label}
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
        ))}
      </ul>
    </div>
  );
}

/* ==========================================================================
   Footer
   ========================================================================== */
export function Footer() {
  return (
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
        {/* Top brand + newsletter section */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div className="space-y-5">
            <Logo variant="default" hideTagline />
            <h2 className="font-display text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-foreground">Built for the</span>
              <span className="block text-gradient-aurora">players.</span>
            </h2>
            <p className="max-w-md text-[13.5px] leading-relaxed text-text-secondary">
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
              </span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-text-tertiary">
                <Mail className="h-3 w-3" strokeWidth={2.4} />
                The Locker Room
              </p>
              <p className="text-[13.5px] leading-relaxed text-text-secondary">
                Get weekly drops on premium venues, exclusive coaches, and member-only tournaments.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="group/news"
            >
              <div className="flex items-stretch gap-2 rounded-2xl border border-border bg-surface/60 p-1.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_4px_var(--primary-soft)]">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-10 w-full bg-transparent px-3 text-sm font-medium text-foreground outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  className="group/sub inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_4px_14px_-4px_rgba(0,102,255,0.45)] transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5"
                    strokeWidth={2.4}
                  />
                </button>
              </div>
              <p className="mt-2 text-[10.5px] text-text-tertiary">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-x-8">
          <FooterColumn title="Explore" items={navigationLinks} />
          <FooterColumn title="Support" items={supportLinks} />
          <FooterColumn title="Community" items={communityLinks} />

          <div className="space-y-4">
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
            <div className="rounded-xl border border-border bg-surface/40 px-3 py-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-text-tertiary">
                Download
              </p>
              <p className="mt-1 text-[12px] font-semibold text-foreground">
                iOS & Android — soon
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 text-[10.5px] text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 <span className="font-semibold text-foreground/80">GameSpot</span>. Built
            for players, by players.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-medium uppercase tracking-[0.14em]">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Cookies
            </Link>
            <Link
              href="/contact"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
