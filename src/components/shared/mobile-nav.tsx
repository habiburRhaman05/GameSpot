"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Compass,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/session";

type NavLinkItem = { label: string; href: string; Icon: typeof Home };

interface MobileNavProps {
  session?: Session | null;
  isPending?: boolean;
  navLinks?: NavLinkItem[];
  onSignOut?: () => Promise<void>;
}

const fallbackNavLinks: NavLinkItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Discover", href: "/venues", Icon: Compass },
  { label: "Organizers", href: "/organizers", Icon: Users },
  { label: "About", href: "/about", Icon: Info },
];

export function MobileNav({
  session,
  isPending,
  navLinks,
  onSignOut,
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData, isPending: isPendingHook } =
    authClient.useSession();
  const [open, setOpen] = useState(false);

  const resolvedSession = session ?? (sessionData as Session | null) ?? null;
  const resolvedPending =
    typeof isPending === "boolean" ? isPending : isPendingHook;
  const resolvedNavLinks = navLinks ?? fallbackNavLinks;
  const avatarSrc = resolvedSession
    ? resolvedSession.user.avatarUrl ||
      resolvedSession.user.image ||
      ""
    : "";

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
      setOpen(false);
      return;
    }
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.refresh();
    setOpen(false);
  };

  const profileHref =
    resolvedSession?.user.role === "ADMIN"
      ? "/admin/profile"
      : resolvedSession?.user.role === "ORGANIZER"
        ? "/organizer/settings"
        : "/dashboard/profile";

  const dashboardHref =
    resolvedSession?.user.role === "ADMIN"
      ? "/admin"
      : resolvedSession?.user.role === "ORGANIZER"
        ? "/organizer"
        : "/dashboard";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        {resolvedSession && (
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarImage src={avatarSrc} alt={resolvedSession.user.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-white">
              {resolvedSession.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-surface/40 text-text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-2 hover:text-foreground active:scale-95"
        >
          <Menu className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
            </div>

            {/* Top bar */}
            <div className="relative flex h-14 items-center justify-between border-b border-border/60 px-4">
              <Logo variant="default" hideTagline />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-surface/40 text-text-secondary transition-all duration-200 hover:border-border-strong hover:bg-surface-2 hover:text-foreground active:scale-95"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>

            {/* User card */}
            {resolvedSession && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary-soft/60 to-accent/10 p-3.5"
              >
                <Avatar className="h-12 w-12 ring-2 ring-primary/30" size="lg">
                  <AvatarImage src={avatarSrc} alt={resolvedSession.user.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-base font-bold text-white">
                    {resolvedSession.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                  <AvatarBadge className="bg-accent ring-2 ring-background" />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold leading-tight text-foreground">
                    {resolvedSession.user.name}
                  </p>
                  <p className="truncate text-[11px] text-text-secondary">
                    {resolvedSession.user.email}
                  </p>
                  <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/15 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-primary">
                    {resolvedSession.user.role}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Nav links */}
            <nav
              aria-label="Mobile primary"
              className="relative flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6"
            >
              {resolvedNavLinks.map((link, i) => {
                const Icon = link.Icon;
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.06,
                      duration: 0.32,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group/mlink relative flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200",
                        active
                          ? "border-primary/40 bg-primary-soft text-foreground shadow-[inset_3px_0_0_var(--primary)]"
                          : "border-transparent text-text-secondary hover:border-border hover:bg-surface-2 hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface-2 text-text-secondary group-hover/mlink:bg-surface-3",
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                        <span className="font-display text-base font-bold uppercase tracking-tight">
                          {link.label}
                        </span>
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          active
                            ? "translate-x-0 text-primary"
                            : "-translate-x-1 opacity-0 group-hover/mlink:translate-x-0 group-hover/mlink:opacity-100",
                        )}
                        strokeWidth={2.2}
                      />
                    </Link>
                  </motion.div>
                );
              })}

              {resolvedSession && (
                <>
                  <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="grid gap-1"
                  >
                    <Link
                      href={dashboardHref}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-surface-2 hover:text-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" strokeWidth={2.2} />
                      Dashboard
                    </Link>
                    <Link
                      href={profileHref}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-surface-2 hover:text-foreground"
                    >
                      <User className="h-4 w-4" strokeWidth={2.2} />
                      Profile
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>

            {/* Footer actions */}
            <div className="relative border-t border-border/60 bg-surface-glass/60 px-4 py-4 backdrop-blur-xl">
              {resolvedPending ? (
                <div className="flex flex-col gap-2">
                  <div className="h-11 w-full animate-pulse rounded-xl bg-surface-2" />
                  <div className="h-11 w-full animate-pulse rounded-xl bg-surface-2" />
                </div>
              ) : resolvedSession ? (
                <div className="flex items-center justify-between gap-3">
                  <ThemeToggle size={40} />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 text-[12px] font-bold uppercase tracking-[0.1em] text-destructive transition-all duration-200 hover:bg-destructive/15 active:scale-[0.98]"
                  >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/signin"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface/60 text-[12px] font-bold uppercase tracking-[0.1em] text-foreground transition-all duration-200 hover:border-border-strong hover:bg-surface-2 active:scale-[0.98]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="group/cta inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-[12px] font-bold uppercase tracking-[0.1em] text-primary-foreground shadow-[0_8px_24px_-8px_rgba(0,102,255,0.5)] transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                    >
                      Get Started
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-tertiary">
                      Theme
                    </span>
                    <ThemeToggle size={32} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
