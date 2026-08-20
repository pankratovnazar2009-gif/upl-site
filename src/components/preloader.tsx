"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const MIN_MS = 900; // always a deliberate brand moment, even on a fast load
const HARD_CAP_MS = 2200; // never make a visitor stare at this longer than ~2.2s
const EASE_INOUT: [number, number, number, number] = [0.83, 0, 0.17, 1];

/**
 * A real (not faked) loading screen: the percentage climbs quickly to ~92%,
 * then holds until the page has actually finished loading (or the hard cap
 * is hit), so it never lies about being "done" before the page is. Runs on
 * every real page load, including a reload — it only mounts once per actual
 * browser navigation, since clicking an internal <Link> doesn't remount the
 * root layout.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [shouldRun, setShouldRun] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    setShouldRun(true);
  }, [reduced]);

  useEffect(() => {
    if (!shouldRun) return;

    document.documentElement.style.overflow = "hidden";

    let ready = document.readyState === "complete";
    const markReady = () => {
      ready = true;
    };
    window.addEventListener("load", markReady, { once: true });

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const rampT = Math.min(elapsed / 1100, 1);
      const eased = 1 - Math.pow(1 - rampT, 3);
      const canFinish = elapsed >= MIN_MS && (ready || elapsed >= HARD_CAP_MS);
      const ceiling = canFinish ? 100 : Math.min(eased * 92, 92);

      setProgress((p) => Math.min(100, Math.max(p, Math.round(ceiling))));

      if (ceiling >= 100) {
        setDone(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", markReady);
    };
  }, [shouldRun]);

  if (!shouldRun) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        // Only unlock scroll once the overlay has actually finished fading
        // out — releasing it at `done` would let the page scroll underneath
        // a still-visible panel.
        document.documentElement.style.overflow = "";
      }}
    >
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_INOUT }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-navy"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE_INOUT }}
          >
            <Image
              src="/logos/upl-mark.png"
              alt=""
              width={96}
              height={96}
              priority
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
          </motion.div>

          <p className="font-display mt-8 text-[15px] font-bold tabular-nums tracking-[0.02em] text-white">
            {progress}%
          </p>

          <div className="mt-4 h-[2px] w-32 overflow-hidden bg-white/15">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
