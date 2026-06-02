"use client";

import { useMemo, useState, useEffect, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Swords } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SPORT_TYPES } from "@/lib/constants/sports";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HeroSection() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [mobileQuery, setMobileQuery] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const submitSearch = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobileValue = mobileQuery.trim();
    const sportValue = sport.trim();
    const locationValue = location.trim() || mobileValue;
    const exactMatchedSport = SPORT_TYPES.find(
      (item) => item.toLowerCase() === mobileValue.toLowerCase(),
    );

    const params = new URLSearchParams();
    if (locationValue) params.set("searchTerm", locationValue);
    if (sportValue) params.set("type", sportValue);
    else if (exactMatchedSport) params.set("type", exactMatchedSport);
    if (date) params.set("date", date);

    const query = params.toString();
    router.push(query ? `/venues?${query}` : "/venues");
  };

  const headline = "The Arena Awaits.";
  const words = headline.split(" ");

  return (
    <section className="relative flex min-h-[90vh] md:min-h-[95vh] items-center overflow-hidden pt-20">
      {/* Parallax Background */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src="/hero.jpg"
          alt="Athletic action"
          loading="eager"
          className="h-full w-full object-cover scale-110"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="mx-auto max-w-4xl md:mx-0">
          {/* Staggered Word Reveal */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center font-display text-[clamp(3.5rem,15vw,7.5rem)] font-bold uppercase leading-[0.82] tracking-tight text-white md:text-left"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-[0.15em]"
              >
                {i === words.length - 1 ? (
                  <span className="text-accent">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-6 max-w-xl text-center text-base md:text-left md:text-lg text-white/80"
          >
            Book premium sports venues. Compete at the highest level.
          </motion.p>
        </div>

        {/* Glass Search Form */}
        <motion.form
          onSubmit={submitSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 max-w-5xl glass rounded-2xl shadow-xl p-2"
        >
          {/* Mobile */}
          <div className="flex gap-2 md:hidden">
            <label className="flex grow items-center gap-3 rounded-xl glass px-4 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30">
              <Search className="h-4 w-4 text-text-secondary" />
              <input
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
                className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-foreground outline-none placeholder:text-text-tertiary"
                placeholder="Search by sport or city"
              />
            </label>
            <button
              type="submit"
              className="flex min-h-14 items-center justify-center bg-primary px-6 font-display text-xs font-black uppercase tracking-widest text-primary-foreground rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              Go
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden gap-2 md:grid lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="rounded-xl glass p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                What sport?
              </p>
              <div className="flex items-center gap-3">
                <Swords className="h-4 w-4 text-primary" />
                <input
                  value={sport}
                  onChange={(event) => setSport(event.target.value)}
                  list="hero-sport-suggestions"
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-foreground outline-none md:text-lg placeholder:text-text-tertiary"
                  placeholder="Football, Tennis..."
                />
              </div>
            </label>

            <label className="rounded-xl glass p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Where?
              </p>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-foreground outline-none md:text-lg placeholder:text-text-tertiary"
                  placeholder="Enter city or area"
                />
              </div>
            </label>

            <label className="rounded-xl glass p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Date
              </p>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full border-0 bg-transparent p-0 font-display text-base font-bold text-foreground outline-none md:text-lg [color-scheme:light]"
                />
              </div>
            </label>

            <button
              type="submit"
              className="flex min-h-[4.5rem] items-center justify-center gap-2 bg-primary px-8 rounded-xl font-display text-sm font-black uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <datalist id="hero-sport-suggestions">
            {SPORT_TYPES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>

          {/* Sport Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-3 flex flex-wrap items-center gap-2 px-1"
          >
            {SPORT_TYPES.slice(0, 8).map((item) => {
              const isActive =
                sport.trim().toLowerCase() === item.toLowerCase();

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSport(isActive ? "" : item)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "glass text-text-secondary hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
