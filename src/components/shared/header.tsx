"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
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
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/session";
import { useScroll } from "@/hooks/use-scroll";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Organizers", href: "/organizers" },
  { label: "Venues", href: "/venues" },
];

export function Header() {
  const scrolled = useScroll(20);
  const pathname = usePathname();
  const { data: rawSession, isPending } = authClient.useSession();
  const session = rawSession as Session | null;
  const router = useRouter();

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 mx-auto w-[calc(100%-1rem)] max-w-7xl transition-all duration-300 md:top-3",
        scrolled
          ? "md:max-w-6xl"
          : "md:max-w-7xl",
      )}
    >
      {/* Glass container */}
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm transition-all duration-300",
          scrolled && "bg-background/85 shadow-md border-border/80",
        )}
      >
        <nav
          className={cn(
            "flex h-16 w-full items-center justify-between px-4 sm:px-6 transition-all duration-300",
            scrolled && "lg:h-14 lg:px-5",
          )}
        >
          {/* Left: Logo + Divider + Tagline */}
          <div className="flex items-center gap-5">
            <Logo />
            <div className="hidden xl:block h-6 w-px bg-border" />
            <p className="hidden xl:block text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">
              Premium Court Booking
            </p>
          </div>

          {/* Center: Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-2/50",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="header-nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary-soft"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Theme Toggle + Auth */}
          <div className="flex items-center gap-3">
            <ThemeToggle size={36} />

            {isPending ? (
              <div className="flex gap-2">
                <div className="hidden md:block h-9 w-24 skeleton rounded-lg" />
                <div className="h-9 w-9 skeleton rounded-full" />
              </div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer" size="default">
                    <AvatarImage
                      src={session.user.avatarUrl || session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary-soft text-primary">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                    <AvatarBadge className="bg-success border-2 border-background" />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-2 mb-1 rounded-lg bg-surface-2/50">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage
                        src={session.user.avatarUrl || session.user.image || ""}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary-soft text-primary">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {session.user.email}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold">
                        {session.user.role}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={profileHref} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    className="rounded-lg text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/signin"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Get Started
                </Link>
              </div>
            )}

            <MobileNav
              session={session}
              isPending={isPending}
              navLinks={navLinks}
              onSignOut={handleSignOut}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
