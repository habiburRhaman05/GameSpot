"use client";

import { useRef, useState, useMemo, useCallback, useEffect, type SyntheticEvent } from "react";
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SPORT_TYPES } from "@/lib/constants/sports";

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════
//  PARTICLE CANVAS — refined
// ═══════════════════════════════════════════════════════════════
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouseX = 0;
    let mouseY = 0;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      baseAlpha: number;
    }> = [];

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      const baseAlpha = Math.random() * 0.3 + 0.1;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: baseAlpha,
        baseAlpha,
      });
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(59, 130, 246, ${0.05 * (1 - dist / 100)})`;
            ctx!.stroke();
          }
        }
      }
    };

    const draw = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.015;
          p.vy += (dy / dist) * 0.015;
          p.alpha = Math.min(p.baseAlpha + 0.25, 0.6);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx!.fill();
      }

      drawConnections();
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}

// ═══════════════════════════════════════════════════════════════
//  3D SPLIT-TEXT REVEAL — refined
// ═══════════════════════════════════════════════════════════════
function AnimatedHeadline({ text }: { text: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const gradientRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const chars = containerRef.current.querySelectorAll(".hero-char");

      gsap.fromTo(
        chars,
        {
          y: 120,
          opacity: 0,
          rotateX: -50,
          scale: 0.7,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.015,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          backgroundPosition: "200% 50%",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <h1
      ref={containerRef}
      className="font-display text-[clamp(2.5rem,11vw,5.5rem)] font-bold uppercase leading-[0.85] tracking-tight text-white"
      style={{ perspective: "1000px" }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-[0.08em]">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="hero-char inline-block will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {word === "Champions" ? (                  <span
                    ref={wIdx === 1 ? gradientRef : undefined}
                    className="bg-gradient-to-r from-blue-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 100%",
                    backgroundPosition: "0% 50%",
                  }}
                >
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
          textContent: (_i: number) =>
            [500, 24, 50][_i],
          duration: 2,
          delay: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
        },
      );
      gsap.fromTo(
        ref.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.8, ease: "power3.out" },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="mt-8 flex flex-wrap items-center gap-8 sm:gap-12"
    >
      {[
        { label: "Venues", value: "500+", end: 500 },
        { label: "Cities", value: "24", end: 24 },
        { label: "Athletes", value: "50K+", end: 50 },
      ].map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            <span data-stat>{stat.end}</span>
            {stat.value.includes("+") && "+"}
            {stat.value.includes("K") && "K"}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HERO SECTION — premium redesign
// ═══════════════════════════════════════════════════════════════
export function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

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
            delay: 0.1,
            ease: "back.out(1.7)",
          },
        );
      }

      // Subtitle with blur reveal
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: 0.9,
            ease: "power3.out",
          },
        );
      }

      // CTA buttons stagger
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("[data-hero-cta]");
        gsap.fromTo(
          btns,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            delay: 1.4,
            ease: "back.out(1.7)",
          },
        );
      }

      // Search form
      if (searchRef.current) {
        gsap.fromTo(
          searchRef.current,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 1.8,
            ease: "power3.out",
          },
        );
      }

      // Content fade wrapper
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0 },
      );
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
      className="relative flex min-h-screen items-center overflow-hidden bg-[#06080f]"
    >
      {/* ═══════ BACKGROUND ═══════ */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070a14] via-[#0c1020] to-[#050712]" />

        {/* Gradient orbs — subtle, refined */}
        <div className="absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] rounded-full opacity-20 blur-[140px]" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.25) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-1/4 -right-1/4 h-[50vw] w-[50vw] rounded-full opacity-15 blur-[120px]" style={{ background: "radial-gradient(circle, rgba(0,210,106,0.18) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/5 h-[30vw] w-[30vw] rounded-full opacity-10 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)" }} />

        {/* Grid pattern — very subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-[#06080f]/30" />
      </div>

      {/* ═══════ PARTICLES ═══════ */}
      <ParticleField />

      {/* ═══════ CONTENT ═══════ */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-screen-2xl px-5 pt-28 md:px-10 md:pt-36 lg:px-16"
      >
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300/70 backdrop-blur-md"
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
            className="mt-5 max-w-xl text-sm font-light leading-relaxed text-white/40 sm:text-base md:text-lg"
          >
            Book world-class venues, challenge top athletes, and own every
            moment. Your rise to greatness starts with a single play.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              data-hero-cta
              type="button"
              onClick={() => router.push("/venues")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md hover:scale-[1.02] active:scale-100"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Search className="h-4 w-4" />
              Explore Courts
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              data-hero-cta
              type="button"
              onClick={() => router.push("/organizers")}
              className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/60 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.12] hover:scale-[1.02] active:scale-100"
            >
              Join as Partner
            </button>
          </div>

          {/* Stats */}
          <StatsBar />
        </div>

        {/* ═══════ SEARCH FORM ═══════ */}
        <form
          ref={searchRef}
          onSubmit={submitSearch}
          className="mx-auto mt-10 max-w-3xl rounded-xl border border-white/[0.04] bg-white/[0.02] p-1.5 backdrop-blur-xl sm:mt-14"
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
                className="group flex items-center gap-2.5 rounded-lg bg-white/[0.02] px-3.5 py-2.5 transition-all duration-200 focus-within:bg-white/[0.06] focus-within:ring-1 focus-within:ring-primary/40 hover:bg-white/[0.04] sm:py-3"
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
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md hover:scale-[1.02] active:scale-100 sm:py-0"
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
                    "rounded-md border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] transition-all duration-200",
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
    </section>
  );
}
