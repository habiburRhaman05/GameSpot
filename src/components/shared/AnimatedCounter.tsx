"use client";

import {
  useMotionValue,
  animate,
  useInView,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ==========================================================================
   Props
   ========================================================================== */
type AnimatedCounterProps = {
  /** Target value to count up to */
  value: number;
  /** Animation duration in seconds (default: 1.5) */
  duration?: number;
  /** Prefix string (e.g. "$", "€") */
  prefix?: string;
  /** Suffix string (e.g. "%", "+") */
  suffix?: string;
  /** Number format function (default: Intl.NumberFormat with comma separator) */
  format?: (n: number) => string;
  className?: string;
};

/* ==========================================================================
   Helpers
   ========================================================================== */
const defaultFormat = (n: number): string =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

/* ==========================================================================
   AnimatedCounter component
   ========================================================================== */
export function AnimatedCounter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  format = defaultFormat,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(format(0));

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => {
        setDisplayValue(format(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, format, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
