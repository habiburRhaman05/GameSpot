"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import {
  blurVariants,
  fadeUpVariants,
  fadeVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  ease,
} from "@/lib/motion";

/* ==========================================================================
   Variant map
   ========================================================================== */
const variantMap = {
  fadeUp: fadeUpVariants,
  fadeIn: fadeVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  blur: blurVariants,
} as const;

export type RevealVariant = keyof typeof variantMap;

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
      viewport={{ once, margin }}
      variants={variantMap[variant]}
      transition={{ duration, delay: delay || undefined, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
