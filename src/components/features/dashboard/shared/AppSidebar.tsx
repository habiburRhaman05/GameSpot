"use client";

import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { dashboardConfig, UserRole } from "../dashboard-config";

type LegacyUserRole = "user" | "organizer" | "admin";

const roleBranding: Record<
  UserRole,
  { primary: string; label: string; tagline: string }
> = {
  USER: {
    primary: "text-primary",
    label: "GameSpot",
    tagline: "Player Dashboard",
  },
  ORGANIZER: {
    primary: "text-accent",
    label: "GameSpot",
    tagline: "Organizer Console",
  },
  ADMIN: {
    primary: "text-tertiary",
    label: "GameSpot",
    tagline: "Admin Console",
  },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: UserRole | LegacyUserRole;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const normalizeRole = (role?: UserRole | LegacyUserRole | null): UserRole => {
  if (!role) return "USER";
  if (role === "user") return "USER";
  if (role === "organizer") return "ORGANIZER";
  if (role === "admin") return "ADMIN";
  return role;
};

export function AppSidebar({
  role = "USER",
  user,
  className,
  ...props
}: AppSidebarProps) {
  const normalizedRole = normalizeRole(role);
  const config = dashboardConfig[normalizedRole];
  const branding = roleBranding[normalizedRole];

  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn("group/sidebar", className)}
      {...props}
    >
      {/* ── Brand header ── */}
      <SidebarHeader className="px-4 pt-6 pb-2">
        <Link href="/" className="group/logo block text-center">
          <div className="flex flex-col items-center gap-2">
            {/* Logo icon */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/20 transition-all duration-300 group-hover/logo:shadow-primary/40 group-hover/logo:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-white"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <line x1="12" y1="3" x2="12" y2="21" opacity={0.5} />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-success" />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col items-center">
              <span className="font-display text-base font-black uppercase tracking-tight">
                <span className={branding.primary}>Game</span>
                <span className="text-sidebar-foreground/80">Spot</span>
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-sidebar-foreground/30">
                {branding.tagline}
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 opacity-60" />

      {/* ── Navigation ── */}
      <SidebarContent className="pt-3 pb-2">
        <NavMain items={config.navMain} />
      </SidebarContent>

      <SidebarSeparator className="mx-4 opacity-60" />

      {/* ── Footer ── */}
      <SidebarFooter className="gap-2 px-3 pb-4 pt-2">
        {normalizedRole === "USER" && (
          <Link
            href="/dashboard/become-organizer"
            className={cn(
              "group/become flex items-center gap-2 rounded-xl border border-white/[0.06] bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2.5 text-center transition-all duration-200 hover:from-primary/15 hover:to-accent/15 hover:border-primary/20",
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors group-hover/become:bg-primary group-hover/become:text-white">
              <IconPlus className="h-3.5 w-3.5" strokeWidth={2.6} />
            </span>
            <span className="text-[11px] font-semibold text-sidebar-foreground/70 transition-colors group-hover/become:text-sidebar-foreground">
              Become an Organizer
            </span>
          </Link>
        )}
        <NavUser
          user={{
            name: user?.name ?? "",
            email: user?.email ?? "",
            avatar: user?.avatar ?? "",
          }}
          role={normalizedRole}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
