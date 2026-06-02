"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-display text-2xl font-bold text-primary-fg">GS</span>
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-primary/20 animate-pulse-soft" />
        </div>
        <LoadingSpinner label="Loading..." className="text-text-tertiary" />
      </div>
    </div>
  );
}
