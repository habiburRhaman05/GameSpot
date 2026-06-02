"use client";

import { useMemo } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { useHomeLandingCourtsQuery } from "@/hooks/queries/use-courts-query";
import type { CourtListItem } from "@/types/court.types";
import { trendingVenues } from "./data";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";

type TrendingVenueCard = {
  id: string;
  slug?: string;
  name: string;
  location: string;
  pricePerHour: number;
  verified?: boolean;
  image: string;
  createdAt?: string;
  bookings: number;
  score: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80";

const getPriceNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const computeTrendScore = (court: CourtListItem, now: Date) => {
  const bookings = court._count?.bookings ?? 0;
  const bookingSignal = Math.log1p(bookings) * 0.7;
  const createdAt = new Date(court.createdAt);
  const ageDays = Number.isNaN(createdAt.getTime())
    ? 30
    : Math.max(0, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const recencySignal = Math.exp(-ageDays / 14) * 0.3;
  return bookingSignal + recencySignal;
};

const mapCourtToTrendingCard = (
  court: CourtListItem,
  now: Date,
): TrendingVenueCard => {
  const primaryImage =
    court.media?.find((item) => item.isPrimary)?.url ??
    court.media?.[0]?.url ??
    FALLBACK_IMAGE;
  return {
    id: court.id,
    slug: court.slug,
    name: court.name,
    location: court.locationLabel,
    pricePerHour: getPriceNumber(court.basePrice),
    verified: (court._count?.bookings ?? 0) >= 5,
    image: primaryImage,
    createdAt: court.createdAt,
    bookings: court._count?.bookings ?? 0,
    score: computeTrendScore(court, now),
  };
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const venueCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function TrendingVenuesSection() {
  const courtsQuery = useHomeLandingCourtsQuery();

  const venues = useMemo<TrendingVenueCard[]>(() => {
    const now = new Date();
    const apiVenues = (courtsQuery.data?.data ?? [])
      .map((court) => mapCourtToTrendingCard(court, now))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    if (apiVenues.length > 0) return apiVenues;
    return trendingVenues.map((venue, index) => ({
      id: venue.id,
      slug: undefined,
      name: venue.name,
      location: venue.location,
      pricePerHour: venue.pricePerHour,
      image: venue.image,
      createdAt: undefined,
      bookings: Math.max(0, 8 - index),
      score: 0,
      verified: venue.verified,
    }));
  }, [courtsQuery.data?.data]);

  return (
    <section className="relative overflow-hidden bg-card px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-screen-2xl">
        <Reveal variant="fadeUp" delay={0.1}>
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-foreground md:text-7xl lg:text-8xl">
                Trending
                <br />
                <span className="mt-1 inline-block text-gradient-primary">
                  Venues
                </span>
              </h2>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                Ranked by recent bookings and freshness
              </p>
            </div>
            <Link
              href="/venues"
              className="hidden items-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-xs font-black uppercase tracking-[0.16em] text-primary-foreground transition-all duration-200 hover:shadow-lg active:scale-[0.98] md:inline-flex"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="overflow-x-auto pb-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-stretch gap-6 pr-6 md:grid md:w-full md:grid-cols-2 lg:grid-cols-4 md:pr-0 xl:gap-8">
            {venues.map((venue, index) => (
              <motion.article
                key={venue.id}
                variants={venueCardVariants}
                className="group relative flex h-[500px] w-[86vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[60vw] md:h-[480px] md:w-auto"
              >
                {/* Image Container */}
                <div className="relative h-[240px] shrink-0 overflow-hidden">
                  <Image
                    src={venue.image}
                    loading="eager"
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 86vw, 25vw"
                    priority={index < 4}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                  {/* Trending Badge */}
                  <div className="absolute left-4 top-4 rounded-lg glass px-3 py-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
                      #{String(index + 1).padStart(2, "0")} Trending
                    </span>
                  </div>

                  {/* Verified Badge */}
                  {venue.verified && (
                    <div className="absolute right-4 top-4 rounded-lg bg-accent px-3 py-1.5 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-accent-fg">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex grow flex-col justify-between gap-4 p-5 md:p-6">
                  <div>
                    <h3 className="line-clamp-2 font-display text-xl font-black uppercase tracking-tight text-foreground xl:text-2xl">
                      {venue.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">
                      <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
                      <span className="truncate">{venue.location}</span>
                    </p>
                  </div>

                  <div className="flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <p className="font-display text-3xl font-black text-foreground xl:text-4xl">
                        ${venue.pricePerHour}
                        <span className="ml-1 text-sm font-bold text-text-secondary">
                          /hr
                        </span>
                      </p>
                    </div>

                    <Link
                      href={venue.slug ? `/venues/${venue.slug}` : "/venues"}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <Link
            href="/venues"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-xs font-black uppercase tracking-[0.16em] text-primary-foreground transition-all duration-200 active:scale-[0.98]"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {courtsQuery.isError && (
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
            Could not fetch live trends. Showing fallback venues.
          </p>
        )}
      </div>
    </section>
  );
}
