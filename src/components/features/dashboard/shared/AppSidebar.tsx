"use client";

import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { dashboardConfig, UserRole } from "../dashboard-config";

type LegacyUserRole = "user" | "organizer" | "admin";

const defaultUser = {
  name: "Marcus Chen",
  email: "premium.partner",
  avatar: "",
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
  user = defaultUser,
  className,
  ...props
}: AppSidebarProps) {
  const normalizedRole = normalizeRole(role);
  const config = dashboardConfig[normalizedRole];

  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn(className)}
      {...props}
    >
      <SidebarHeader className="px-4 pt-5 pb-4">
        <Link href="/" className="block group">
          <p className="font-display text-center text-lg font-black tracking-tight text-foreground uppercase transition-all duration-200 group-hover:text-primary">
            <span className="text-primary">COURT</span>{" "}
            <span className="text-foreground/80">CONNECT</span>
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-1 pb-3">
        <NavMain items={config.navMain} />
      </SidebarContent>

      <SidebarFooter className="gap-3 px-2 pb-4">
        {normalizedRole === "USER" && (
          <Link
            href="/dashboard/become-organizer"
            className={cn(
              buttonVariants({ variant: "glass" }),
              "h-11 w-full justify-center text-xs font-bold uppercase tracking-[0.12em]",
            )}
          >
            <IconPlus className="mr-1.5 size-4" />
            Become an Organizer
          </Link>
        )}
        <NavUser user={{ ...user, avatar: user.avatar ?? "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
