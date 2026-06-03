"use client";

import * as React from "react";
import { IconChevronDown, type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  badge?: string | number;
  items?: readonly {
    title: string;
    url: string;
  }[];
};

export function NavMain({
  items,
}: {
  items: readonly NavItem[];
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    {},
  );

  React.useEffect(() => {
    setOpenGroups((previous) => {
      const next = { ...previous };
      let hasChanges = false;

      for (const item of items) {
        const childActive =
          !!item.items?.length &&
          !!item.items.some((subItem) => pathname === subItem.url);

        if (childActive && !next[item.title]) {
          next[item.title] = true;
          hasChanges = true;
        }
      }

      return hasChanges ? next : previous;
    });
  }, [items, pathname]);

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((previous) => ({
      ...previous,
      [groupTitle]: !previous[groupTitle],
    }));
  };

  // Group nav items into sections
  const mainItems = items.filter((item) => !item.items?.length);
  const groupItems = items.filter((item) => !!item.items?.length);

  const renderNavItem = (item: NavItem) => {
    const hasChildren = !!item.items?.length;
    const isDirectActive = pathname === item.url;
    const isChildActive = !!item.items?.some(
      (subItem) => pathname === subItem.url,
    );
    const isActive = isDirectActive || isChildActive;
    const isExpanded = hasChildren
      ? (openGroups[item.title] ?? isChildActive)
      : false;

    return (
      <SidebarMenuItem key={item.title}>
        <div className="relative group">
          {/* Active indicator — refined pill */}
          {isActive && (
            <span className="absolute -left-2 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,102,255,0.4)]" />
          )}

          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip={item.title}
            className={cn(
              "h-10 rounded-lg text-[13px] font-medium tracking-tight transition-all duration-200",
              hasChildren && "pr-10",
              isActive
                ? "bg-primary/10 text-primary font-semibold shadow-sm"
                : "text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground/80",
            )}
          >
            <Link href={item.url}>
              {item.icon && (
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-sidebar-foreground/40",
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              )}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>

          {/* Badge */}
          {item.badge != null && !hasChildren && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[9px] font-bold text-primary">
              {item.badge}
            </span>
          )}

          {/* Expand/collapse chevron */}
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleGroup(item.title)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
              className={cn(
                "absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 transition-all duration-200",
                isActive
                  ? "text-primary/60 hover:text-primary hover:bg-primary/10"
                  : "text-sidebar-foreground/30 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent",
              )}
            >
              <IconChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  isExpanded && "rotate-180",
                )}
              />
            </button>
          )}
        </div>

        {/* Sub-items */}
        {hasChildren && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <SidebarMenuSub className="mt-1 ml-2.5 border-l border-sidebar-border/60 pl-3">
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                    className={cn(
                      "h-8 rounded-md text-[12px] transition-all duration-200",
                      pathname === subItem.url
                        ? "text-primary font-medium bg-primary/8"
                        : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent",
                    )}
                  >
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </div>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <div className="flex flex-col gap-1 px-2">
      {/* Main navigation group */}
      <SidebarGroup className="px-0 py-0">
        <SidebarGroupContent className="flex flex-col gap-0.5">
          <SidebarMenu>
            {mainItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Grouped items (with children) — with section label */}
      {groupItems.length > 0 && (
        <>
          <SidebarGroup className="px-0 py-0">
            <SidebarGroupLabel className="px-2 pt-3 pb-1 text-[8px] font-bold uppercase tracking-[0.24em] text-sidebar-foreground/25">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-0.5">
              <SidebarMenu>
                {groupItems.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}
    </div>
  );
}
