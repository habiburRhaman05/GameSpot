"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

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
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-xs font-semibold uppercase tracking-widest text-text-secondary transition-all duration-200 hover:text-primary hover:translate-x-0.5 inline-block"
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
    <footer className="w-full md:max-w-7xl md:mb-10 md:rounded-2xl md:mx-auto border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-14 sm:px-8 lg:px-12 lg:pt-18">
        {/* Top Section: Heading + Newsletter */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="space-y-5">
            <h2 className="inline-block font-display text-5xl font-black uppercase leading-[0.84] tracking-[-0.03em] text-gradient-aurora sm:text-7xl lg:text-8xl">
              <span className="block">Court</span>
              <span className="block">Connect</span>
            </h2>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                Member of the SKILLEX Network
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <p className="max-w-md text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary sm:text-sm">
              Subscribe to the journal for elite scouting reports and private
              venue drops.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-3"
            >
              <div className="flex items-end gap-2 border-b border-border pb-2 group focus-within:border-primary transition-colors duration-200">
                <input
                  type="email"
                  placeholder="YOUR@EMAIL.COM"
                  className="h-11 w-full bg-transparent font-display text-2xl font-black uppercase tracking-tight text-foreground outline-none placeholder:text-text-tertiary sm:text-3xl lg:text-4xl"
                />
                <button
                  type="submit"
                  className="mb-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-text-tertiary">
                No spam. Premium venue insights only.
              </p>
            </form>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Navigation" items={navigationLinks} />
          <FooterColumn title="Support" items={supportLinks} />
          <FooterColumn title="Community" items={communityLinks} />

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Social Connection
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-surface-2/50 px-3 text-xs font-bold uppercase tracking-[0.12em] text-text-secondary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.16em] text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Court Connect Network. Built for players.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-200">
              Privacy Charter
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-200">
              Terms of Presence
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors duration-200">
              Cookie Integrity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
