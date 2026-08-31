"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Splits text on \n into lines and reveals each one rising from behind a
 * mask — the signature move from the reference set, not a plain fade.
 *
 * `eager` animates on mount instead of on scroll-into-view — use it for
 * above-the-fold headings, where waiting for 60% scroll visibility just
 * reads as a blank gap since the heading is usually already on screen.
 */
export function SplitHeading({
  text,
  className,
  as = "h1",
  eager = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  eager?: boolean;
}) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");
  const Tag = as;

  return (
    <Tag className={className}>
      {lines.map((line, i) => {
        const revealProps = reduced
          ? {}
          : eager
            ? { initial: { y: "100%" }, animate: { y: 0 } }
            : { initial: { y: "100%" }, whileInView: { y: 0 }, viewport: { once: true, amount: 0.6 } };
        return (
          <span key={i} className="block overflow-hidden">
            <motion.span
              className="block"
              {...revealProps}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.08 }}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
