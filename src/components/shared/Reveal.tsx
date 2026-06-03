"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { revealVariantsMap, type RevealVariant } from "@/lib/motion";

export type { RevealVariant };

/* ==========================================================================
   Props
   ========================================================================== */
type RevealProps = {
  children: ReactNode;
  /** Animation variant (default: "fadeUp") */
  variant?: RevealVariant;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Trigger animation only once (default: true) */
  once?: boolean;
  /** Margin for IntersectionObserver (CSS value) */
  margin?: string;
  className?: string;
};

/* ==========================================================================
   Reveal component
   ========================================================================== */
export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration,
  once = true,
  margin = "-40px 0px",
  className,
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin } as never}
      variants={revealVariantsMap[variant]}
      transition={{ duration, delay: delay || undefined }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
