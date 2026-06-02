"use client";

import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.refresh();
  };

  return (
    <SidebarMenu className="px-2 pb-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface-2/30 px-3 py-2.5 text-left transition-all duration-200 hover:bg-surface-2 hover:border-border-strong">
              <Avatar className="h-8 w-8 rounded-lg border border-border" size="default">
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary-soft text-primary text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
                <AvatarBadge className="bg-success border-2 border-background" />
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.14em] text-text-secondary font-bold">
                  {user.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-lg"
          >
            <DropdownMenuItem className="flex items-center gap-2 rounded-md px-2 py-2 text-foreground cursor-pointer">
              <IconUser className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 rounded-md px-2 py-2 text-foreground cursor-pointer">
              <IconSettings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-destructive cursor-pointer focus:text-destructive"
            >
              <IconLogout className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
