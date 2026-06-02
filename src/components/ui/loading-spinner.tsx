"use client";

import { motion } from "framer-motion";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
  size?: number;
};

export function LoadingSpinner({
  label = "Loading...",
  className,
  size = 4,
}: LoadingSpinnerProps) {
  const dotSize = size * 2.5;

  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`.trim()}>
      <span className="relative inline-flex" style={{ width: dotSize * 3 + 8, height: dotSize }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: dotSize,
              height: dotSize,
              left: i * (dotSize + 4),
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </span>
  );
}
