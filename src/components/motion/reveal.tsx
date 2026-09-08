"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  /** Stagger direct children instead of animating this element as one block. */
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "li";
};

/**
 * Reveals a block once it reaches the viewport.
 *
 * The transition itself is plain CSS (see `.reveal` in globals.css) rather
 * than a JS-driven animation: a compositor transition still finishes when the
 * tab is throttled, so a section can never be left stuck at opacity 0. The
 * hook measures on mount as well as observing, because a tall block — a
 * 40-player squad grid — would otherwise stay blank until you scrolled deep
 * into it.
 */
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);

  // Once the reveal has been triggered, force the end state shortly after the
  // transition should have finished. A transition that never advances (a
  // throttled or unfocused tab stops compositing) would otherwise leave the
  // block stranded at whatever opacity it froze at.
  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(() => setSettled(true), 700);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setRevealed(true);
      return;
    }

    // Pre-arm anything within 240px of the fold so it is never caught blank.
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 240 && rect.bottom > -240) {
        setRevealed(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          cleanup();
        }
      },
      { rootMargin: "0px 0px 240px 0px", threshold: 0 },
    );
    // Cheap backstop for anything the observer misses (in-page anchor jumps,
    // layout shifts after images load).
    const timer = window.setInterval(() => {
      if (check()) cleanup();
    }, 200);
    // Last-resort safety net: whatever the observer, the interval or a
    // throttled tab does, a block is never left hidden for longer than this.
    const failsafe = window.setTimeout(() => {
      setRevealed(true);
      cleanup();
    }, 4000);
    const cleanup = () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(failsafe);
    };

    observer.observe(el);
    return cleanup;
  }, []);

  return { ref, revealed, settled };
}

export function Reveal({
  children,
  delay = 0,
  className,
  id,
  stagger = false,
  as: Component = "div",
}: RevealProps) {
  const { ref, revealed, settled } = useRevealed<HTMLElement>();

  return (
    <Component
      ref={ref as React.RefObject<never>}
      id={id}
      className={`reveal${stagger ? " reveal-group" : ""}${revealed ? " in" : ""}${settled ? " settled" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal-item${className ? ` ${className}` : ""}`}>{children}</div>;
}
