"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, MenuIcon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/session";

type NavLink = { label: string; href: string };

interface MobileNavProps {
  session?: Session | null;
  isPending?: boolean;
  navLinks?: NavLink[];
  onSignOut?: () => Promise<void>;
}

const fallbackNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Organizers", href: "/organizers" },
  { label: "Venues", href: "/venues" },
];

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

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

  const resolvedSession = session ?? sessionData ?? null;
  const resolvedPending =
    typeof isPending === "boolean" ? isPending : isPendingHook;
  const resolvedNavLinks = navLinks ?? fallbackNavLinks;
  const avatarSrc = resolvedSession
    ? resolvedSession.user.image ||
      ((resolvedSession.user as { avatarUrl?: string | null }).avatarUrl ?? "")
    : "";

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
      setOpen(false);
      return;
    }
    await authClient.signOut();
    toast.success("Signed out successfully!");
    router.refresh();
    setOpen(false);
  };

  const profileHref =
    (resolvedSession as Session | null)?.user.role === "ADMIN"
      ? "/admin/profile"
      : (resolvedSession as Session | null)?.user.role === "ORGANIZER"
        ? "/organizer/settings"
        : "/dashboard/profile";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 lg:hidden">
        {resolvedSession ? (
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={avatarSrc}
              alt={resolvedSession.user.name || "User"}
            />
            <AvatarFallback className="bg-primary-soft text-primary">
              {resolvedSession.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="h-9 w-9 touch-manipulation"
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="left"
        className="w-[86vw] max-w-sm overflow-y-auto border-r border-border bg-background p-0 sm:w-90"
      >
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="text-base font-semibold tracking-wide text-foreground">
            Navigation
          </SheetTitle>
          <p className="text-xs text-text-secondary">
            Discover venues and manage your Court Connect profile.
          </p>
        </SheetHeader>

        <div className="space-y-4 px-6 pb-6 pt-4">
          {/* User card */}
          <AnimatePresence>
            {resolvedSession && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-surface-2/50 px-3 py-2.5"
              >
                <p className="truncate text-sm font-semibold text-foreground">
                  {resolvedSession.user.name}
                </p>
                <p className="truncate text-xs text-text-secondary">
                  {resolvedSession.user.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Links */}
          <div className="grid gap-2">
            {resolvedNavLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-11 w-full justify-start rounded-lg text-sm text-foreground/85 hover:bg-surface-2 hover:text-foreground",
                    pathname === link.href &&
                      "bg-primary-soft text-primary hover:bg-primary-soft/80 hover:text-primary",
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <Separator variant="gradient" />

          {/* Auth Section */}
          {resolvedPending ? (
            <div className="flex flex-col gap-3">
              <div className="h-10 w-full skeleton rounded-lg" />
              <div className="h-10 w-full skeleton rounded-lg" />
            </div>
          ) : resolvedSession ? (
            <div className="grid gap-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full justify-start")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href={profileHref}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full justify-start")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(buttonVariants({ variant: "destructive" }), "h-11 w-full justify-start")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full justify-start")}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "default" }), "h-11 w-full justify-start")}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">Theme</span>
            <ThemeToggle size={32} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
