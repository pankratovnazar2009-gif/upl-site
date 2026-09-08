"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/lib/upl-source";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * A Premier-League-style news module — one big story, a handful of others
 * to pick from underneath it — but with our own twist instead of a straight
 * copy: the picker row doesn't just link out, clicking a card swaps it into
 * the big story above so you can browse headlines and photos before
 * committing to leaving the site.
 */
export function FeaturedNews({ items }: { items: NewsItem[] }) {
  const t = useTranslations("home");
  const reduced = useReducedMotion();
  const slides = items.filter((i) => i.image);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;
  const active = slides[index];

  return (
    <div className="flex flex-col gap-3">
      {/* On a phone the headline sits under the photo instead of over it — an
          overlay long enough for a four-line title covered the picture. */}
      <a
        href={active.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden border border-fg-faint bg-brand-navy sm:aspect-[16/9] lg:aspect-[16/8]"
      >
        <div className="relative aspect-[16/10] w-full sm:absolute sm:inset-0 sm:aspect-auto sm:h-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Image
                src={active.image!}
                alt=""
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/10 to-transparent sm:block" />
        </div>

        <div className="pointer-events-none relative bg-bg-raised p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-7">
          <p className="text-label uppercase tracking-[0.08em] text-fg-muted sm:text-white/70">
            {t("latestNews")} · {active.date}
          </p>
          <p className="mt-2 max-w-3xl font-display text-[19px] font-bold leading-snug sm:mt-2.5 sm:text-[28px] sm:text-white">
            {active.title}
          </p>
          {active.excerpt && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-fg-muted sm:mt-2.5 sm:text-[15px] sm:text-white/70">
              {active.excerpt}
            </p>
          )}
        </div>
      </a>

      {/* Phones get a swipeable strip rather than a stack of five cards — the
          picker stays one thumb-flick tall instead of pushing everything else
          off the screen. */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index}
            className={`group flex w-[62%] shrink-0 snap-start flex-col border text-left transition-colors duration-200 sm:w-auto sm:shrink ${
              i === index ? "border-accent bg-bg-raised" : "border-fg-faint hover:bg-bg-raised/60"
            }`}
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden bg-brand-navy">
              <Image
                src={item.image!}
                alt=""
                fill
                sizes="(min-width: 1024px) 15vw, 45vw"
                className={`object-cover transition-all duration-300 ${
                  i === index ? "" : "brightness-[0.85] group-hover:brightness-100"
                }`}
              />
            </span>
            <span className="flex flex-1 flex-col p-2.5">
              <span
                className={`line-clamp-3 text-[12.5px] font-semibold leading-snug ${
                  i === index ? "text-accent" : "text-fg"
                }`}
              >
                {item.title}
              </span>
              <span className="mt-auto pt-2 text-[10.5px] text-fg-muted">{item.date}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
