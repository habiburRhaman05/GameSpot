"use client";

import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/session";
import { AppSidebar } from "./AppSidebar";
import { DashboardWeatherChip } from "./DashboardWeatherChip";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PageTransition } from "@/components/shared/PageTransition";
import { Search } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: rawSession } = authClient.useSession();
  const session = rawSession as Session | null;

  const user = session?.user;

  const roleLabel =
    user?.role === "ADMIN"
      ? "Admin Console"
      : user?.role === "ORGANIZER"
        ? "Organizer Console"
        : "Dashboard";

  const roleGreeting = !user
    ? "Loading..."
    : `Welcome back, ${user.name?.split(" ")[0] || "there"}`;

  return (
    <SidebarProvider className="overflow-x-hidden">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <AppSidebar
        role={user?.role}
        user={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          avatar: user?.avatarUrl ?? user?.image ?? "",
        }}
      />

      <SidebarInset className="min-w-0 overflow-x-clip relative z-10">
        {/* ── Premium top bar ── */}
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-5">
            {/* Left: trigger + page context */}
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg border border-border/60 bg-surface/50 text-foreground/70 transition-all duration-200 hover:bg-surface hover:text-foreground hover:border-border" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-tertiary sm:text-[11px]">
                  {roleLabel}
                </p>
                <p className="hidden text-[13px] font-semibold text-foreground/80 sm:block">
                  {roleGreeting}
                </p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Search trigger */}
              <button
                type="button"
                className="hidden h-9 items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-3 text-[12px] text-text-tertiary transition-all duration-200 hover:bg-surface hover:text-foreground hover:border-border sm:inline-flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
                <kbd className="ml-2 inline-flex h-5 items-center rounded border border-border/60 bg-surface-2/60 px-1.5 text-[9px] font-semibold text-text-tertiary">
                  ⌘K
                </kbd>
              </button>

              <DashboardWeatherChip />
              <ThemeToggle size={32} />
            </div>
          </div>
        </header>

        {/* ── Content area ── */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:p-8">
          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col *:min-w-0">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
