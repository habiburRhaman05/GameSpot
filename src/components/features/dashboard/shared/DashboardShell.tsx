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

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: rawSession } = authClient.useSession();
  const session = rawSession as Session | null;

  const user = session?.user;

  const roleLabel =
    user?.role === "ADMIN"
      ? "Admin Console"
      : user?.role === "ORGANIZER"
        ? "Organizer Console"
        : "User Dashboard";

  return (
    <SidebarProvider className="overflow-x-hidden">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
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
        {/* Glass Top Bar */}
        <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="h-10 w-10 rounded-lg border border-border bg-surface-2/50 text-foreground hover:bg-surface-2 md:h-11 md:w-11" />
              <div className="min-w-0">
                <p className="truncate text-[11px] uppercase tracking-[0.14em] text-text-secondary font-bold sm:text-xs">
                  {user ? roleLabel : "Loading..."}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <DashboardWeatherChip />
              <ThemeToggle size={32} />
            </div>
          </div>
        </div>

        {/* Content Area with Page Transition */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col *:min-w-0">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
