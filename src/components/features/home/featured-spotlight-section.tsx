"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useHomeLandingCourtsQuery } from "@/hooks/queries/use-courts-query";
import { VENUE_FALLBACK_IMAGE } from "@/lib/placeholders";
import type { CourtListItem } from "@/types/court.types";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";

type SpotlightVenue = {
  titleMain: string;
  titleAccent: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  price: number;
  detailHref: string;
};

const staticFallbackVenue: SpotlightVenue = {
  titleMain: "The Titanium",
  titleAccent: "Monolith",
  location: "Los Angeles District, CA",
  description:
    "Designed by world-renowned architects, the Monolith represents the pinnacle of urban sports infrastructure. Featuring hybrid turf technology and elite broadcast capabilities.",
  image: "/image2.png",
  imageAlt: "Premium arena architecture",
  price: 450,
  detailHref: "/venues",
};

const toPriceNumber = (value: string | number) => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapCourtToSpotlightVenue = (court: CourtListItem): SpotlightVenue => {
  const venueNameParts = court.name.trim().split(/\s+/).filter(Boolean);
  const hasAccentSplit = venueNameParts.length > 1;
  const titleMain = hasAccentSplit
    ? venueNameParts.slice(0, -1).join(" ")
    : court.name;
  const titleAccent = hasAccentSplit
    ? venueNameParts[venueNameParts.length - 1]
    : "Spotlight";
  const image =
    court.media?.find((item) => item.isPrimary)?.url ??
    court.media?.[0]?.url ??
    VENUE_FALLBACK_IMAGE;
  return {
    titleMain,
    titleAccent,
    location: court.locationLabel,
    description:
      "This venue is currently leading booking demand across the platform. Explore the court profile and secure your slot before prime hours are gone.",
    image,
    imageAlt: `${court.name} venue image`,
    price: toPriceNumber(court.basePrice),
    detailHref: `/venues/${court.slug}`,
  };
};

export function FeaturedSpotlightSection() {
  const courtsQuery = useHomeLandingCourtsQuery();

  const spotlightVenue = useMemo<SpotlightVenue>(() => {
    const courts = courtsQuery.data?.data ?? [];
    const topBookedCourt = [...courts]
      .filter((court) => (court._count?.bookings ?? 0) > 0)
      .sort((a, b) => (b._count?.bookings ?? 0) - (a._count?.bookings ?? 0))[0];
    return topBookedCourt
      ? mapCourtToSpotlightVenue(topBookedCourt)
      : staticFallbackVenue;
  }, [courtsQuery.data?.data]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/95 px-5 py-18 text-primary-foreground sm:px-6 md:px-10 md:py-24 lg:px-12 lg:py-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-18">
        <Reveal variant="slideLeft" delay={0.1}>
          <div className="max-w-2xl">
            <span className="mb-7 inline-flex rounded-lg bg-accent/20 px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.16em] text-accent">
              Featured Venue
            </span>

            <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
              {spotlightVenue.titleMain}
              <br />
              <span className="text-accent">{spotlightVenue.titleAccent}</span>
            </h2>

            <p className="mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/65">
              <MapPin className="h-4 w-4 text-accent" /> {spotlightVenue.location}
            </p>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-primary-foreground/82">
              {spotlightVenue.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={spotlightVenue.detailHref}
                className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 font-display text-xs font-black uppercase tracking-[0.16em] text-accent-fg transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98] sm:px-10"
              >
                Book This Space
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideRight" delay={0.2}>
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            {/* Price Card - Floating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 left-4 z-20 rounded-xl glass px-5 py-4 shadow-lg sm:left-6 sm:px-6 sm:py-5 md:left-8"
            >
              <p className="font-display text-4xl font-black leading-none text-accent sm:text-5xl">
                ${spotlightVenue.price}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/70">
                Hourly Rate Session
              </p>
            </motion.div>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-primary-foreground/10 shadow-2xl">
              <Image
                src={spotlightVenue.image}
                loading="eager"
                alt={spotlightVenue.imageAlt}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
