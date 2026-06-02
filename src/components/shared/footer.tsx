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
              </span>
            </div>
          </div>

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
          </div>
        </div>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Navigation" items={navigationLinks} />
          <FooterColumn title="Support" items={supportLinks} />
          <FooterColumn title="Community" items={communityLinks} />

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
