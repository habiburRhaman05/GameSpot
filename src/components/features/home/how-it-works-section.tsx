"use client";

import { CheckCircle2, Compass, Trophy } from "lucide-react";
import { motion } from "framer-motion";

import { steps } from "./data";
import { Reveal } from "@/components/shared/Reveal";

const icons = [Compass, CheckCircle2, Trophy];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HowItWorksSection() {
  return (
    <section className="bg-surface px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 md:gap-12 lg:gap-14">
        <Reveal variant="fadeUp" delay={0.1}>
          <div className="text-center lg:text-left">
            <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Elite Access,
              <br />
              <span className="mt-1 inline-block text-gradient-primary">
                Streamlined.
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0 lg:max-w-lg">
              We removed the barriers between you and the field. Professional
              grade booking for serious athletes.
            </p>
          </div>
        </Reveal>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = icons[index] ?? Compass;

            return (
              <motion.article
                key={step.id}
                variants={cardVariants as any}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl glass p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Large background number */}
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[8rem] font-black leading-none tracking-tight text-foreground/[0.03] select-none sm:text-[10rem]">
                  {step.id}
                </span>

                {/* Icon in circle */}
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-16 sm:w-16">
                  <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-[2rem]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {step.description}
                </p>

                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                    GameSpot Flow
                    <span className="h-px w-8 bg-primary/30" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
