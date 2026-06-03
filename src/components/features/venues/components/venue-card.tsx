"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourtListItem } from "@/types/court.types";

// HELPERS
const formatPrice = (value: string | number): string => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "N/A";
  return `$${numericValue.toLocaleString()}`;
};

const getPrimaryImage = (media?: { url: string }[]): string | null => {
  if (!media || media.length === 0) return null;
  return media[0]?.url ?? null;
};

type VenueCardProps = {
  court: CourtListItem;
};

export function VenueCard({ court }: VenueCardProps) {
  const router = useRouter();
  const imageUrl = getPrimaryImage(court.media);
  const bookingCount = court._count?.bookings ?? 0;

  const handleCardClick = () => {
    router.push(`/venues/${court.slug}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-muted sm:h-64">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={court.name}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge
            variant="default"
            className="rounded-none bg-primary/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-primary-foreground backdrop-blur-sm"
          >
            {court.type}
          </Badge>
          {bookingCount > 25 && (
            <Badge
              variant="premium"
              className="rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]"
            >
              Premier
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute right-3 top-3">
          <div className="rounded-sm bg-foreground/60 px-3 py-1.5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-background/60">
              From
            </p>
            <p className="font-display text-lg font-black text-background">
              {formatPrice(court.basePrice)}
            </p>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 pb-3 pt-10">
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-background/10 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-tertiary text-tertiary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-background">
              {bookingCount > 50 ? "Top Rated" : "Verified"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-background/70">
            <Users className="h-3 w-3" />
            {bookingCount}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-base font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
            {court.name}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary/40" />
            {court.locationLabel}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Hourly Rate
            </p>
            <p className="font-display text-lg font-black text-foreground">
              {formatPrice(court.basePrice)}
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="gap-1.5 rounded-sm px-3 text-xs font-bold uppercase tracking-wider"
          >
            Book
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
