"use client";

import * as React from "react";
import { IconChevronDown, type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: readonly {
    title: string;
    url: string;
    icon?: Icon;
    items?: readonly {
      title: string;
      url: string;
    }[];
  }[];
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

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupContent className="flex flex-col gap-1.5">
        <SidebarMenu>
          {items.map((item) => {
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
                  {/* Active left border indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary" />
                  )}

                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "h-11 rounded-lg text-[13px] font-medium tracking-tight text-foreground/70 transition-all duration-200 hover:bg-primary-soft hover:text-primary",
                      hasChildren && "pr-10",
                      isActive &&
                        "bg-primary-soft text-primary hover:bg-primary-soft/80 hover:text-primary font-semibold",
                    )}
                  >
                    <Link href={item.url}>
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "size-4",
                            isActive && "text-primary",
                          )}
                        />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.title)}
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded ? "Collapse section" : "Expand section"
                      }
                      className={cn(
                        "absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-foreground/50 transition-colors hover:bg-surface-2 hover:text-foreground",
                        isActive && "text-primary",
                      )}
                    >
                      <IconChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <SidebarMenuSub className="mt-1 ml-3 rounded-lg border-l-2 border-primary-soft pl-3">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                          className={cn(
                            "h-8 rounded-md text-[13px] text-foreground/60 hover:text-foreground hover:bg-surface-2",
                            pathname === subItem.url &&
                              "text-primary font-medium bg-primary-soft/50 hover:bg-primary-soft/50 hover:text-primary",
                          )}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
