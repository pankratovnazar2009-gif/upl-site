"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/lib/upl-source";

const SLIDE_MS = 5000;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * A boxed, self-advancing "latest news" panel — not a full-bleed hero. Drags
 * with the pointer (mouse or touch) to move manually; otherwise drifts on
 * its own every few seconds. Pauses while the pointer is on it.
 */
export function NewsBox({ items }: { items: NewsItem[] }) {
  const t = useTranslations("home");
  const reduced = useReducedMotion();
  const slides = items.filter((i) => i.image);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, reduced, count]);

  if (count === 0) return null;
  const slide = slides[index];

  function goTo(i: number) {
    setIndex(((i % count) + count) % count);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -50 || info.velocity.x < -400) goTo(index + 1);
    else if (info.offset.x > 50 || info.velocity.x > 400) goTo(index - 1);
    setPaused(false);
  }

  return (
    <div
      className="relative aspect-[4/3] w-full select-none overflow-hidden border border-fg-faint bg-brand-navy sm:aspect-[16/12]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="pointer-events-none absolute left-4 top-3.5 z-10 text-label uppercase tracking-[0.08em] text-white/70">
        {t("latestNews")}
      </p>

      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragStart={() => setPaused(true)}
          onDragEnd={handleDragEnd}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <Image
            src={slide.image!}
            alt=""
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="pointer-events-none object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/20" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[11px] font-medium tabular-nums text-white/60">{slide.date}</p>
        <a
          href={slide.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-1.5 block font-display text-[15px] font-bold leading-snug text-white transition-opacity hover:opacity-80 sm:text-[17px]"
        >
          {slide.title}
        </a>
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5 sm:bottom-5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
