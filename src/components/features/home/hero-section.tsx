"use client";

import { useRef, useState, useMemo, useEffect, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Search,
  MapPin,
  CalendarDays,
  Swords,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Trophy,
  Play,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SPORT_TYPES } from "@/lib/constants/sports";

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════
//  3D SPLIT-TEXT REVEAL — premium word-by-word
// ═══════════════════════════════════════════════════════════════
function AnimatedHeadline({ text }: { text: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const chars = containerRef.current.querySelectorAll(".hero-char");

      gsap.fromTo(
        chars,
        {
          y: 80,
          opacity: 0,
          rotateX: -60,
          scale: 0.6,
          filter: "blur(12px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.012,
          ease: "power4.out",
          delay: 0.3,
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <h1
      ref={containerRef}
      className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-white"
      style={{ perspective: "1200px" }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-[0.2em]">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="hero-char inline-block will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {word === "Made" ? (
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  {char}
                </span>
              ) : (
                char
              )}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STATS COUNTER — refined
// ═══════════════════════════════════════════════════════════════
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const numbers = ref.current.querySelectorAll("[data-stat]");
      gsap.fromTo(
        numbers,
        { textContent: 0 },
        {
          textContent: (_i: number) => [500, 24, 50][_i],
          duration: 2,
          delay: 2.2,
          ease: "power2.out",
          snap: { textContent: 1 },
        },
      );
      gsap.fromTo(
        ref.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 2.0, ease: "power3.out" },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="mt-6 flex items-center gap-6 sm:gap-8"
    >
      {[
        { label: "Venues", value: "500+ ", end: 500 },
        { label: "Cities", value: "24 ", end: 24 },
        { label: "Athletes", value: "50K+ ", end: 50 },
      ].map((stat, i) => (
        <div key={stat.label} className="flex flex-col border-l border-white/[0.08] pl-6 first:border-0 first:pl-0">
          <span className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            <span data-stat>{stat.end}</span>
            {stat.value.includes("+") && "+"}
            {stat.value.includes("K") && "K"}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BRANDING ILLUSTRATION — right side premium visual
// ═══════════════════════════════════════════════════════════════
function BrandingIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Floating orbs entrance
      const orbs = containerRef.current.querySelectorAll(".brand-orb");
      gsap.fromTo(
        orbs,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "elastic.out(1, 0.5)",
          delay: 0.5,
        },
      );

      // Rotating rings — second ring spins opposite direction
      const rings = containerRef.current.querySelectorAll(".brand-ring");
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: i === 0 ? 30 : 24,
          repeat: -1,
          ease: "none",
        });
      });

      // Floating cards
      const cards = containerRef.current.querySelectorAll(".brand-card");
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.8,
        },
      );

      // Brand wordmark
      const wordmark = containerRef.current.querySelector(".brand-wordmark");
      if (wordmark) {
        gsap.fromTo(
          wordmark,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: "power3.out" },
        );
      }

      // Glow pulse
      const glow = containerRef.current.querySelector(".brand-glow");
      if (glow) {
        gsap.to(glow, {
          scale: 1.1,
          opacity: 0.6,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center"
    >
      {/* ── Ambient glow ── */}
      <div className="brand-glow pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(0,210,106,0.15) 50%, transparent 80%)" }}
        />
      </div>

      {/* ── Rotating ring ── */}
      <div className="brand-ring absolute h-[340px] w-[340px] rounded-full border border-white/[0.04]"
        style={{ borderStyle: "dashed" }}
      />
      <div className="brand-ring absolute h-[280px] w-[280px] rounded-full border border-white/[0.06]"
        style={{ animationDirection: "reverse" }}
      />

      {/* ── Floating orbs ── */}
      <div className="brand-orb absolute left-[10%] top-[12%] h-3 w-3 rounded-full bg-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
      <div className="brand-orb absolute right-[15%] top-[18%] h-2 w-2 rounded-full bg-emerald-400/50 shadow-[0_0_16px_rgba(52,211,153,0.5)]" />
      <div className="brand-orb absolute bottom-[20%] left-[18%] h-2.5 w-2.5 rounded-full bg-amber-400/40 shadow-[0_0_18px_rgba(251,191,36,0.5)]" />
      <div className="brand-orb absolute bottom-[15%] right-[12%] h-2 w-2 rounded-full bg-purple-400/40 shadow-[0_0_14px_rgba(167,139,250,0.5)]" />
      <div className="brand-orb absolute left-[5%] bottom-[40%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />

      {/* ── Center brand wordmark ── */}
      <div className="brand-wordmark relative z-10 flex flex-col items-center gap-3">
        {/* Logo mark — abstract court shape */}
        <div className="relative mb-2">
          <div className="h-20 w-20 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-2xl backdrop-blur-sm">
            <svg viewBox="0 0 60 60" fill="none" className="h-full w-full">
              {/* Court lines */}
              <rect x="4" y="4" width="52" height="52" rx="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="30" y1="4" x2="30" y2="56" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
              <circle cx="30" cy="30" r="12" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
              <circle cx="30" cy="30" r="2" fill="rgba(59,130,246,0.6)" />
              {/* Top zone */}
              <rect x="10" y="4" width="16" height="14" rx="2" stroke="rgba(255,184,0,0.2)" strokeWidth="1" />
              {/* Bottom zone */}
              <rect x="34" y="42" width="16" height="14" rx="2" stroke="rgba(0,210,106,0.2)" strokeWidth="1" />
            </svg>
          </div>
          {/* Glow behind logo */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/20 blur-xl" />
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center">
          <span className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-black uppercase tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Game
            </span>
            <span className="text-white/90">Spot</span>
          </span>
          <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.35em] text-white/20">
            Elite Sports Network
          </span>
        </div>
      </div>

      {/* ── Floating venue preview cards ── */}
      <div className="brand-card absolute left-[6%] top-[22%] w-[140px] overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 backdrop-blur-md shadow-xl"
        style={{ animation: "float 6s ease-in-out infinite" }}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/15">
            <Trophy className="h-2.5 w-2.5 text-emerald-400" />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-wider text-white/30">Top Rated</span>
        </div>
        <div className="h-12 w-full rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20" />
        <p className="mt-1.5 text-[8px] font-semibold text-white/50">Titanium Arena</p>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-1.5 w-1.5 fill-amber-400/70 text-amber-400/70" />
          ))}
          <span className="ml-1 text-[7px] text-white/25">4.9</span>
        </div>
      </div>

      <div className="brand-card absolute bottom-[25%] right-[4%] w-[130px] overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 backdrop-blur-md shadow-xl"
        style={{ animation: "float 6s ease-in-out infinite 2s" }}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/15">
            <Zap className="h-2.5 w-2.5 text-amber-400" />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-wider text-white/30">Live Now</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
            <Play className="h-2.5 w-2.5 fill-blue-400 text-blue-400" />
          </div>
          <div>
            <p className="text-[8px] font-semibold text-white/50">Basketball</p>
            <p className="text-[6px] text-white/20">Court 3 • In Play</p>
          </div>
        </div>
      </div>

      {/* ── Decorative grid dots ── */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HERO SECTION — premium two-column redesign
// ═══════════════════════════════════════════════════════════════
export function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // ─── GSAP master timeline ───────────────────────────────
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // ScrollTrigger parallax on background
      gsap.to(bgRef.current, {
        y: 100,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Left column entrance
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, delay: 0.1, ease: "power3.out" },
        );
      }

      // Right column entrance
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" },
        );
      }

      // Center divider
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 1.2, delay: 0.4, ease: "power3.out" },
        );
      }

      // Badge entrance
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { x: -20, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: 0.2,
            ease: "back.out(1.7)",
          },
        );
      }

      // Subtitle with blur reveal
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: 1.0,
            ease: "power3.out",
          },
        );
      }

      // CTA buttons stagger
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("[data-hero-cta]");
        gsap.fromTo(
          btns,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            delay: 1.5,
            ease: "back.out(1.7)",
          },
        );
      }

      // Search form
      if (searchRef.current) {
        gsap.fromTo(
          searchRef.current,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 1.9,
            ease: "power3.out",
          },
        );
      }
    },
    { scope: sectionRef },
  );

  // ─── Search submit ──────────────────────────────────────
  const submitSearch = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const sv = sport.trim();
    const lv = location.trim();
    if (lv) params.set("searchTerm", lv);
    if (sv) params.set("type", sv);
    if (date) params.set("date", date);
    const query = params.toString();
    router.push(query ? `/venues?${query}` : "/venues");
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#06080f]"
    >
      {/* ═══════ BACKGROUND ═══════ */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070a14] via-[#0c1020] to-[#050712]" />

        {/* Gradient orbs — positioned for two-column feel */}
        <div className="absolute -left-1/4 top-1/4 h-[40vw] w-[40vw] rounded-full opacity-20 blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(0,102,255,0.3) 0%, transparent 70%)" }}
        />
        <div className="absolute -right-1/4 bottom-1/4 h-[35vw] w-[35vw] rounded-full opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(0,210,106,0.2) 0%, transparent 70%)" }}
        />
        <div className="absolute right-[20%] top-[20%] h-[25vw] w-[25vw] rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%)" }}
        />

        {/* Grid pattern — very subtle */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-[#06080f]/30" />
      </div>

      {/* ═══════ TWO-COLUMN LAYOUT ═══════ */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-5 pt-28 md:px-10 md:pt-32 lg:px-16">
        <div className="grid min-h-[calc(90vh-10rem)] items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">

          {/* ── LEFT COLUMN — Text + Search ── */}
          <div
            ref={leftRef}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300/70 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <Sparkles className="h-3 w-3 text-blue-400/50" />
              GameSpot — Elite Sports Network
            </div>

            {/* Headline */}
            <AnimatedHeadline text="Where Champions Are Made" />

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/35 sm:text-base"
            >
              Book world-class venues, challenge top athletes, and own every
              moment. Your rise to greatness starts with a single play.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <button
                data-hero-cta
                type="button"
                onClick={() => router.push("/venues")}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.03] active:scale-100"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <Search className="h-4 w-4" />
                Explore Courts
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              <button
                data-hero-cta
                type="button"
                onClick={() => router.push("/organizers")}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.14] hover:scale-[1.03] active:scale-100"
              >
                Join as Partner
              </button>
            </div>

            {/* Stats */}
            <StatsBar />

            {/* ── Search Form ── */}
            <form
              ref={searchRef}
              onSubmit={submitSearch}
              className="mt-8 max-w-xl rounded-2xl border border-white/[0.05] bg-white/[0.02] p-1.5 backdrop-blur-xl"
            >
              <div className="grid gap-1.5 sm:grid-cols-[1fr_1fr_1fr_auto]">
                {[
                  {
                    icon: Swords,
                    label: "Sport",
                    value: sport,
                    set: setSport,
                    placeholder: "Any sport...",
                    inputList: "hero-sport-suggestions",
                    type: "text" as const,
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: location,
                    set: setLocation,
                    placeholder: "City or area...",
                    type: "text" as const,
                  },
                  {
                    icon: CalendarDays,
                    label: "Date",
                    value: date,
                    set: setDate,
                    type: "date" as const,
                    min: today,
                  },
                ].map((field) => (
                  <label
                    key={field.label}
                    className="group flex items-center gap-2.5 rounded-xl bg-white/[0.02] px-3.5 py-2.5 transition-all duration-200 focus-within:bg-white/[0.06] focus-within:ring-1 focus-within:ring-primary/40 hover:bg-white/[0.04] sm:py-3"
                  >
                    <field.icon className="h-3.5 w-3.5 shrink-0 text-blue-400/40 transition-colors duration-200 group-focus-within:text-blue-400" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] font-bold uppercase tracking-[0.22em] text-white/20">
                        {field.label}
                      </span>
                      <input
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        {...(field.inputList
                          ? { list: field.inputList }
                          : {})}
                        {...(field.type === "date"
                          ? { type: "date", min: field.min }
                          : { type: "text" })}
                        className="w-full border-0 bg-transparent p-0 text-xs font-medium text-white outline-none placeholder:text-white/15"
                        placeholder={field.placeholder}
                      />
                    </div>
                  </label>
                ))}

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-md hover:scale-[1.02] active:scale-100 sm:py-0"
                  aria-label="Search venues"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Find Court</span>
                </button>
              </div>

              <datalist id="hero-sport-suggestions">
                {SPORT_TYPES.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              {/* Sport pills */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1 px-1 pb-1">
                {SPORT_TYPES.slice(0, 8).map((item) => {
                  const active = sport.trim().toLowerCase() === item.toLowerCase();
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSport(active ? "" : item)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] transition-all duration-200",
                        active
                          ? "border-primary/40 bg-primary/15 text-blue-300"
                          : "border-white/[0.05] text-white/20 hover:border-white/[0.15] hover:text-white/40",
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </form>
          </div>

          {/* ── CENTER DIVIDER ── */}
          <div
            ref={dividerRef}
            className="hidden lg:flex h-[400px] w-px origin-top flex-col items-center justify-center"
          >
            <div className="h-full w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
          </div>

          {/* ── RIGHT COLUMN — Branding & Illustration ── */}
          <div
            ref={rightRef}
            className="relative flex min-h-[400px] items-center justify-center py-10 lg:min-h-0"
          >
            <BrandingIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
