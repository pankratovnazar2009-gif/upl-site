"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/lib/upl-source";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SLIDE_MS = 7000;

export function NewsHero({ items }: { items: NewsItem[] }) {
  const t = useTranslations("home");
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = items.filter((i) => i.image);
  const count = slides.length;

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, reduced, count]);

  if (count === 0) return null;
  const slide = slides[index];

  return (
    <section
      className="relative h-[78vh] max-h-[760px] min-h-[520px] w-full overflow-hidden bg-brand-navy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image!}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Scrim — always dark/light-text regardless of site theme, standard for photo heroes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

      <div className="relative flex h-full flex-col justify-end px-(--gutter) pb-14 sm:pb-16">
        <p className="text-label uppercase tracking-[0.14em] text-white/70">
          {t("kicker")}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mt-3 max-w-2xl"
          >
            <p className="text-[13px] font-medium tabular-nums text-white/60">{slide.date}</p>
            <h1 className="font-display mt-2 text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.02] text-white">
              {slide.title}
            </h1>
            {slide.excerpt && (
              <p className="mt-3 hidden max-w-lg text-[15px] leading-relaxed text-white/75 sm:block">
                {slide.excerpt}
              </p>
            )}
            <a
              href={slide.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-70"
            >
              {t("readNews")}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <div className="mt-10 flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
                className="group relative h-[3px] w-9 overflow-hidden bg-white/25"
              >
                {i === index && (
                  <motion.span
                    key={reduced ? "static" : slide.id}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={
                      reduced || paused
                        ? { duration: 0.3 }
                        : { duration: SLIDE_MS / 1000, ease: "linear" }
                    }
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
