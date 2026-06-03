import type { Transition, Variants } from "motion/react";

/* ==========================================================================
   Easing curves — refined for athletic, premium feel
   ========================================================================== */
export const ease = {
  /** Smooth deceleration — primary easing for reveals */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Standard ease-in-out */
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  /** Gentle spring overshoot */
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  /** Athletic snap — punchy decisive */
  snap: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

/* ==========================================================================
   Durations — snappier per sports media spec
   ========================================================================== */
export const duration = {
  fast: 0.15,
  base: 0.18,
  slow: 0.32,
  slower: 0.5,
} as const;

/* ==========================================================================
   Shared transitions
   ========================================================================== */
export const transitions = {
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.out } satisfies Transition,
  spring: {
    type: "spring",
    stiffness: 280,
    damping: 26,
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

/** Bigger upward slide — more dramatic than fadeUp */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
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

/** Card-style scale-up reveal */
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
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
   Page transition — snappier 250ms feel
   ========================================================================== */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: ease.out },
  },
};

/* ==========================================================================
   Variant map (used by <Reveal />)
   ========================================================================== */
export const revealVariantsMap = {
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  scaleUp: scaleUpVariants,
  blur: blurVariants,
} as const;

export type RevealVariant = keyof typeof revealVariantsMap;
