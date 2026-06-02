"use client";

import { DottedMap } from "@/components/ui/dotted-map";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Reveal } from "@/components/shared/Reveal";

const globalMetrics = [
  { id: "venues", value: 420, suffix: "+", label: "Total Venues" },
  { id: "cities", value: 68, suffix: "", label: "Cities Covered" },
  { id: "amenities", value: 150, suffix: "+", label: "Total Amenities" },
  { id: "coming-soon", value: 200, suffix: "+", label: "Coming Soon 2024" },
] as const;

const globalCityMarkers = [
  { lat: 51.5074, lng: -0.1278, size: 0.8, pulse: true },
  { lat: 40.7128, lng: -74.006, size: 0.8, pulse: true },
  { lat: 48.8566, lng: 2.3522, size: 0.8, pulse: true },
  { lat: 35.6762, lng: 139.6503, size: 0.8, pulse: true },
  { lat: 25.2048, lng: 55.2708, size: 0.8, pulse: true },
  { lat: -33.8688, lng: 151.2093, size: 0.8, pulse: true },
  { lat: 52.52, lng: 13.405, size: 0.8, pulse: true },
] as const;

export function GlobalPresenceSection() {
  return (
    <section className="bg-gradient-to-br from-primary via-primary to-primary/95 px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute top-20 right-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-12 z-10">
        <Reveal variant="slideLeft" delay={0.1}>
          <div>
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.34em] text-accent">
              Global Coverage
            </p>

            <h2 className="font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Global
              <br />
              <span className="text-accent">Presence.</span>
            </h2>

            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-primary-foreground/80 sm:text-2xl">
              From the concrete courts of New York to the elite fields of London.
              We are where the game happens.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-10 sm:mt-14 sm:gap-x-16 sm:gap-y-12">
              {globalMetrics.map((item) => (
                <article key={item.id}>
                  <p className="font-display text-5xl font-black leading-none text-accent sm:text-6xl">
                    <AnimatedCounter
                      value={item.value}
                      suffix={item.suffix}
                      duration={1.5}
                    />
                  </p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary-foreground/85">
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variant="slideRight" delay={0.2}>
          <aside className="flex items-stretch">
            <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl border border-white/10 bg-primary/50 p-4 md:min-h-[400px] lg:min-h-[450px]">
              <DottedMap
                className="h-full w-full brightness-125"
                dotColor="rgba(255,255,255,0.34)"
                markerColor="var(--accent)"
                markers={[...globalCityMarkers]}
                dotRadius={0.24}
                pulse
                mapSamples={7000}
              />
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
