import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2">
        <Icon className="h-6 w-6 text-text-tertiary" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-tertiary">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
