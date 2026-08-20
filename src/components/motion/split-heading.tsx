"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Splits text on \n into lines and reveals each one rising from behind a
 * mask — the signature move from the reference set, not a plain fade.
 */
export function SplitHeading({
  text,
  className,
  as = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");
  const Tag = as;

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? undefined : { y: "100%" }}
            whileInView={reduced ? undefined : { y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
