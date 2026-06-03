"use client";

import { IconLogout, IconSettings, IconUser, IconLayoutDashboard } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { UserRole } from "../dashboard-config";

const roleBadgeColors: Record<UserRole, string> = {
  USER: "bg-primary/20 text-primary border-primary/30",
  ORGANIZER: "bg-accent/20 text-accent border-accent/30",
  ADMIN: "bg-tertiary/20 text-tertiary border-tertiary/30",
};

const roleLabels: Record<UserRole, string> = {
  USER: "Player",
  ORGANIZER: "Organizer",
  ADMIN: "Admin",
};

export function NavUser({
  user,
  role = "USER",
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  role?: UserRole;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.refresh();
  };

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <SidebarMenu className="px-0">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group/user flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border/50 bg-sidebar-accent/40 px-3 py-2.5 text-left transition-all duration-200 hover:bg-sidebar-accent hover:border-sidebar-border">
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9 rounded-lg border border-sidebar-border" size="default">
                  <AvatarImage src={user.avatar || ""} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 text-xs font-bold text-sidebar-foreground/70">
                    {initials}
                  </AvatarFallback>
                  <AvatarBadge className="h-2.5 w-2.5 bg-success border-2 border-sidebar" />
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-sidebar-foreground">
                  {user.name || "Guest"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center rounded px-1 py-px text-[8px] font-bold uppercase tracking-[0.14em] border ${roleBadgeColors[role]}`}
                  >
                    {roleLabels[role]}
                  </span>
                </div>
              </div>
              <svg className="h-4 w-4 shrink-0 text-sidebar-foreground/30 transition-transform duration-200 group-hover/user:text-sidebar-foreground/50" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-56 rounded-xl border-border p-1.5"
          >
            {/* User info header */}
            <div className="px-2.5 py-2">
              <p className="text-sm font-semibold text-foreground">{user.name || "Guest"}</p>
              <p className="text-[11px] text-text-tertiary">{user.email || "No email"}</p>
            </div>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem asChild className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/70 cursor-pointer focus:text-foreground">
              <Link href="/dashboard/profile">
                <IconUser className="h-4 w-4 text-foreground/40" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/70 cursor-pointer focus:text-foreground">
              <Link href="/dashboard">
                <IconLayoutDashboard className="h-4 w-4 text-foreground/40" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-foreground/70 cursor-pointer focus:text-foreground">
              <IconSettings className="h-4 w-4 text-foreground/40" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-destructive cursor-pointer focus:text-destructive"
            >
              <IconLogout className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
