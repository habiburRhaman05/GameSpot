import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "skeleton rounded-lg",
        className,
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-4 w-56" />
          <SkeletonBlock className="h-[300px] w-full" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-[250px] w-full rounded-full" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="h-4 w-64" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
