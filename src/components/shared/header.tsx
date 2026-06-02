"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Zap,
} from "lucide-react";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/session";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/venues" },
  { label: "Organizers", href: "/organizers" },
  { label: "About", href: "/about" },
];

// ─── Magnetic link wrapper ──────────────────────────────────
function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = linkRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
        isActive
          ? "text-foreground"
          : "text-text-secondary hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-1 -bottom-px h-px rounded-full bg-primary transition-all duration-200",
          isActive
            ? "opacity-100 scale-x-100"
            : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}

// ─── Header Component ──────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: rawSession, isPending } = authClient.useSession();
  const session = rawSession as Session | null;

  const headerRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Scroll listener ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── GSAP entrance ───────────────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      );

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        );
      }

      if (navRef.current) {
        const links = navRef.current.querySelectorAll("a");
        tl.fromTo(
          links,
          { y: -8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }

      if (actionsRef.current) {
        const children = actionsRef.current.children;
        tl.fromTo(
          children,
          { y: -8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.out",
          },
          "-=0.2",
        );
      }
    },
    { scope: headerRef },
  );

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully!");
    router.refresh();
  };

  const profileHref =
    session?.user.role === "ADMIN"
      ? "/admin/profile"
      : session?.user.role === "ORGANIZER"
        ? "/organizer/settings"
        : "/dashboard/profile";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 w-full px-4 pt-3 sm:px-6"
    >
      <div
        ref={innerRef}
        className={cn(
          "mx-auto flex h-12 max-w-6xl items-center justify-between rounded-xl px-4 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-14 sm:px-5",
          scrolled
            ? "border border-border-strong bg-card/80 shadow-md backdrop-blur-xl"
            : "border border-border bg-card/40 backdrop-blur-sm",
        )}
      >
        {/* ─── Left: Logo ─────────────────────────────────── */}
        <div ref={logoRef} className="flex items-center gap-3">
          <Logo variant="default" hideTagline />
          <div className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary sm:block">
            Elite Sports Network
          </span>
        </div>

        {/* ─── Center: Nav ──────────────────────────────── */}
        <div ref={navRef} className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isActive={isActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ─── Right: Actions ────────────────────────────── */}
        <div ref={actionsRef} className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle size={32} />

          {isPending ? (
            <div className="flex gap-2">
              <div className="hidden h-8 w-16 animate-pulse rounded-md bg-surface-2 sm:block" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
            </div>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className="h-8 w-8 cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 hover:ring-offset-background"
                  size="default"
                >
                  <AvatarImage
                    src={session.user.avatarUrl || session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                  <AvatarBadge className="bg-success border-2 border-background" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border border-border bg-popover/95 p-1.5 backdrop-blur-xl"
              >
                <div className="mb-1 flex items-center gap-2.5 rounded-lg bg-muted/50 p-2.5">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={session.user.avatarUrl || session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {session.user.name}
                    </p>
                    <p className="truncate text-[11px] text-text-secondary">
                      {session.user.email}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary/70">
                      {session.user.role}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md text-text-secondary hover:bg-surface-2 hover:text-foreground"
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span className="text-xs">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md text-text-secondary hover:bg-surface-2 hover:text-foreground"
                >
                  <Link href={profileHref} className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-md text-destructive/80 hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="text-xs">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 lg:flex">
              <Link
                href="/signin"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className:
                    "text-text-secondary hover:text-foreground h-8 text-xs",
                })}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "h-8 text-xs px-3",
                })}
              >
                <Zap className="h-3 w-3 mr-1" />
                Get Started
              </Link>
            </div>
          )}

          {/* ─── Mobile hamburger ────────────────────────── */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:text-foreground hover:bg-surface-2 lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[80vw] max-w-xs border-l border-border bg-background/95 p-0 backdrop-blur-2xl sm:w-80"
            >
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-sm font-semibold text-foreground">
                    Navigation
                  </SheetTitle>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-foreground hover:bg-surface-2"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </SheetHeader>
              <div className="space-y-4 px-5 pb-6 pt-4">
                {session && (
                  <div className="rounded-lg border border-border bg-surface-2/50 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {session.user.name}
                    </p>
                    <p className="truncate text-[11px] text-text-secondary">
                      {session.user.email}
                    </p>
                  </div>
                )}
                <div className="grid gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex h-10 items-center rounded-md px-3 text-xs font-medium transition-colors duration-150",
                        isActive(link.href)
                          ? "bg-primary-soft text-primary"
                          : "text-text-secondary hover:bg-surface-2 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="h-px bg-border" />
                {isPending ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-9 w-full animate-pulse rounded-md bg-surface-2" />
                    <div className="h-9 w-full animate-pulse rounded-md bg-surface-2" />
                  </div>
                ) : session ? (
                  <div className="grid gap-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-10 items-center gap-2 rounded-md px-3 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-foreground transition-colors duration-150"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <Link
                      href={profileHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-10 items-center gap-2 rounded-md px-3 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-foreground transition-colors duration-150"
                    >
                      <User className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex h-10 items-center gap-2 rounded-md px-3 text-xs font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-10 items-center justify-center rounded-md border border-border text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-foreground transition-colors duration-150"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-10 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary-hover"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Get Started
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                  <span className="text-xs font-medium text-foreground/70">
                    Theme
                  </span>
                  <ThemeToggle size={28} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
