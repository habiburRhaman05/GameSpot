"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      {/* Left Panel — Hero Image with Multi-Layer Gradient Overlay */}
      <section className="relative flex w-full min-h-[50vh] flex-col justify-between overflow-hidden md:h-full md:w-1/2 lg:w-[55%]">
        <div className="absolute inset-0 z-0">
          <Image
            className="object-cover opacity-70 transition-opacity duration-1000"
            alt="Elite arena athlete"
            src="/image3.png"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-accent/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-12 lg:p-16">
          {/* Logo */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xl font-black tracking-tight text-white md:text-2xl lg:text-3xl"
            >
              <span className="text-accent">COURT</span> CONNECT
            </Link>
          </div>

          {/* Stats + Headline */}
          <div className="mt-auto space-y-8 md:mb-16">
            {/* Headline */}
            <div>
              <h1 className="font-display text-4xl font-black tracking-tighter text-white uppercase leading-[0.95] md:text-5xl lg:text-6xl xl:text-[5.5rem]">
                BEYOND THE <br />
                <span className="text-accent">LIMITS.</span>
              </h1>
              <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-white/85 md:text-lg lg:text-xl">
                Join the most exclusive network of high-performance athletes and
                professional venue organizers.
              </p>
            </div>

            {/* Floating Glass Stat Cards */}
            <div className="flex gap-6 md:gap-10 lg:gap-14">
              <div className="glass rounded-xl px-5 py-4 md:px-6 md:py-5">
                <div className="font-display text-3xl font-black leading-none text-accent md:text-[2.5rem]">
                  <AnimatedCounter value={2.4} suffix="k" duration={1.5} format={(n) => n.toFixed(1).replace(".0", "")} />
                  <span>+</span>
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 sm:text-xs">
                  Active Venues
                </div>
              </div>
              <div className="glass rounded-xl px-5 py-4 md:px-6 md:py-5">
                <div className="font-display text-3xl font-black leading-none text-accent md:text-[2.5rem]">
                  <AnimatedCounter value={150} suffix="k" duration={1.5} />
                  <span>+</span>
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 sm:text-xs">
                  Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel — Clean Form Area */}
      <section className="relative flex w-full items-center justify-center bg-background p-6 sm:p-8 md:h-full md:w-1/2 md:overflow-y-auto md:p-12 lg:w-[45%] lg:p-16">
        <div className="flex w-full max-w-md flex-col">
          {/* Logo entrance on mobile */}
          <div className="mb-8 md:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xl font-black tracking-tight text-foreground"
            >
              <span className="text-primary">COURT</span> CONNECT
            </Link>
          </div>

          <div className="flex-1">{children}</div>

          <div className="mx-auto mt-12 flex w-full items-center justify-between pt-8 text-[10px] font-bold uppercase tracking-widest text-text-secondary sm:text-xs">
            <div>© 2026 COURT CONNECT</div>
            <div className="flex gap-4">
              <a href="#" className="transition-colors hover:text-primary">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Terms
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
