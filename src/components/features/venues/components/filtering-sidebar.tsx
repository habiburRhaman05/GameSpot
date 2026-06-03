"use client";

import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CourtAmenity } from "@/types/court.types";

// ROBUST FILTERING SIDEBAR COMPONENT WITH MOBILE DRAWER SUPPORT
type FilteringSidebarProps = {
  hasActiveFilters: boolean;
  searchQuery: string;
  selectedTypes: string[];
  selectedAmenityIds: string[];
  maxPrice: number;
  maxPriceCap: number;
  sortBy: string;
  typeOptions: string[];
  amenities: CourtAmenity[];
  amenitiesLoading: boolean;
  amenitiesError: boolean;
  onSearchChange: (value: string) => void;
  onToggleType: (type: string) => void;
  onToggleAmenity: (amenityId: string) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
};

const formatPrice = (value: number): string => `$${value.toLocaleString()}`;

function FilterContent({
  hasActiveFilters,
  searchQuery,
  selectedTypes,
  selectedAmenityIds,
  maxPrice,
  maxPriceCap,
  sortBy,
  typeOptions,
  amenities,
  amenitiesLoading,
  amenitiesError,
  onSearchChange,
  onToggleType,
  onToggleAmenity,
  onMaxPriceChange,
  onSortChange,
  onClear,
}: FilteringSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </h2>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClear}
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </Button>
        ) : null}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label
          htmlFor="venue-search"
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            id="venue-search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Venue or location..."
            className="h-10 rounded-sm border-border bg-surface pl-9 text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Sport Type */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Sport Type
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {typeOptions.map((sport) => {
            const active = selectedTypes.includes(sport);

            return (
              <button
                key={sport}
                type="button"
                onClick={() => onToggleType(sport)}
                className={cn(
                  "flex h-9 items-center justify-between rounded-sm border px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <span>{sport}</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  active ? "text-primary-foreground/70" : "text-muted-foreground/50",
                )}>
                  {active ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Max Hourly Rate</span>
          <span className="text-foreground">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={20}
          max={maxPriceCap}
          step={5}
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
        />
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Amenities
        </p>
        {amenitiesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-6 w-full rounded-sm" />
            ))}
          </div>
        ) : amenitiesError ? (
          <p className="text-xs text-destructive">Failed to load amenities.</p>
        ) : (
          <div className="space-y-1">
            {amenities.map((amenity) => {
              const active = selectedAmenityIds.includes(amenity.id);
              return (
                <label
                  key={amenity.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggleAmenity(amenity.id)}
                    className="size-3.5 rounded-sm border-border accent-primary"
                  />
                  <span className="font-medium">{amenity.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label
          htmlFor="sortBy"
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        >
          Sort By
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 w-full rounded-sm border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-rating">Highest Rated</option>
          <option value="basePrice">Price: Low to High</option>
          <option value="-basePrice">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}

export function FilteringSidebar(props: FilteringSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="flex items-center gap-2 lg:hidden">
        <Button
          type="button"
          size="sm"
          className="gap-2 rounded-sm"
          onClick={() => setIsOpen(true)}
          variant="outline"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {props.hasActiveFilters && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4">
              <h2 className="font-display text-sm font-black uppercase tracking-tight text-foreground">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1.5 transition-colors hover:bg-surface-2"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent {...props} />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-border bg-card p-4">
              <Button
                type="button"
                className="w-full rounded-sm"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden h-fit space-y-6 rounded-sm border border-border bg-card p-5 lg:sticky lg:top-24 lg:block">
        <FilterContent {...props} />
      </aside>
    </>
  );
}
