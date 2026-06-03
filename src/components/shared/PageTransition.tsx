"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { pageVariants } from "@/lib/motion";

/* ==========================================================================
   Props
   ========================================================================== */
type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

/* ==========================================================================
   PageTransition component
   ========================================================================== */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
