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
      <a
        href={active.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[4/3] overflow-hidden border border-fg-faint bg-brand-navy sm:aspect-[16/9] lg:aspect-[16/8]"
      >
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-label uppercase tracking-[0.08em] text-white/70">
            {t("latestNews")} · {active.date}
          </p>
          <p className="mt-2.5 max-w-3xl font-display text-[22px] font-bold leading-snug text-white sm:text-[28px]">
            {active.title}
          </p>
          {active.excerpt && (
            <p className="mt-2.5 max-w-2xl line-clamp-2 text-[13.5px] leading-relaxed text-white/70 sm:text-[15px]">
              {active.excerpt}
            </p>
          )}
        </div>
      </a>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index}
            className={`group flex flex-col border text-left transition-colors duration-200 ${
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
