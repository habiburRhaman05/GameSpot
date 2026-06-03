import { Button } from "@/components/ui/button";
import type { CourtListItem } from "@/types/court.types";

import { VenueCard } from "./venue-card";

export type VenueGridView = "grid" | "map";

type VenueGridProps = {
  courts: CourtListItem[];
  view: VenueGridView;
  isLoading: boolean;
  isError: boolean;
  pageLimit: number;
  onRetry: () => void;
};

function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      {/* Image skeleton */}
      <div className="skeleton h-56 sm:h-64" />
      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        <div className="space-y-2">
          <div className="skeleton h-5 w-3/4 rounded-sm" />
          <div className="skeleton h-3.5 w-1/2 rounded-sm" />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="space-y-1">
            <div className="skeleton h-2.5 w-16 rounded-sm" />
            <div className="skeleton h-5 w-12 rounded-sm" />
          </div>
          <div className="skeleton h-8 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function VenueGrid({
  courts,
  view,
  isLoading,
  isError,
  pageLimit,
  onRetry,
}: VenueGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: pageLimit }).map((_, idx) => (
          <VenueCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="font-display text-lg font-black uppercase tracking-tight text-destructive">
          Failed to Load Venues
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while fetching venues. Please try again.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="rounded-sm border border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-primary/10">
          <svg
            className="h-8 w-8 text-primary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <p className="font-display text-lg font-black uppercase tracking-tight text-foreground">
          No Venues Found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters to discover more arenas.
        </p>
      </div>
    );
  }

  if (view === "map") {
    return (
      <div className="space-y-4 rounded-sm border border-border bg-card p-4">
        <div className="rounded-sm border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Map integration coming soon. For now, showing coordinate-enabled venues.
          </p>
        </div>

        <div className="space-y-3">
          {[...courts]
            .sort(
              (a, b) =>
                Number(Boolean(b.latitude && b.longitude)) -
                Number(Boolean(a.latitude && a.longitude)),
            )
            .map((court) => (
              <div
                key={court.id}
                className="flex flex-col gap-3 rounded-sm border border-border bg-background p-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
                    {court.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {court.locationLabel}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {court.latitude ?? "N/A"}, {court.longitude ?? "N/A"}
                  </p>
                </div>

                <Button size="sm" variant="outline" type="button" className="shrink-0">
                  View
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {courts.map((court) => (
        <VenueCard key={court.id} court={court} />
      ))}
    </div>
  );
}
