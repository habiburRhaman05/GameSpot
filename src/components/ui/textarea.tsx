import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full min-w-0 rounded-lg border border-border bg-surface/50 px-3 py-2.5 text-sm transition-all duration-200 outline-none placeholder:text-text-tertiary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-not-allowed resize-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
