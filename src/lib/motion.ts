import type { Transition, Variants } from "framer-motion";

/* ==========================================================================
   Easing curves
   ========================================================================== */
export const ease = {
  out: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

/* ==========================================================================
   Durations
   ========================================================================== */
export const duration = {
  fast: 0.15,
  base: 0.2,
  slow: 0.4,
  slower: 0.6,
} as const;

/* ==========================================================================
   Shared transitions
   ========================================================================== */
export const transitions = {
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.out } satisfies Transition,
  spring: {
    type: "spring",
    stiffness: 260,
    damping: 22,
  } satisfies Transition,
} as const;

/* ==========================================================================
   Variants library
   ========================================================================== */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
};

export const blurVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/* ==========================================================================
   Page transition
   ========================================================================== */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/* ==========================================================================
   Variant map (used by <Reveal />)
   ========================================================================== */
export const revealVariantsMap = {
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  fade: fadeVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  blur: blurVariants,
} as const;

export type RevealVariant = keyof typeof revealVariantsMap;
