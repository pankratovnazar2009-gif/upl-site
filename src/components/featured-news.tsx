"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "@/lib/upl-source";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * A Premier-League-style news module — one big story, a handful of others
 * picked from beside it — but with our own twist instead of a straight
 * copy: the side list doesn't just link out, clicking one swaps it into
 * the big preview on the left so you can browse headlines and photos
 * before committing to leaving the site.
 */
export function FeaturedNews({ items }: { items: NewsItem[] }) {
  const t = useTranslations("home");
  const reduced = useReducedMotion();
  const slides = items.filter((i) => i.image);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;
  const active = slides[index];

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.7fr_1fr]">
      <a
        href={active.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[4/3] overflow-hidden border border-fg-faint bg-brand-navy sm:aspect-video lg:h-full lg:aspect-auto"
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
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-label uppercase tracking-[0.08em] text-white/70">
            {t("latestNews")} · {active.date}
          </p>
          <p className="mt-2 font-display text-[19px] font-bold leading-snug text-white sm:text-[23px]">
            {active.title}
          </p>
          {active.excerpt && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/70 sm:text-[13.5px]">
              {active.excerpt}
            </p>
          )}
        </div>
      </a>

      <div className="flex flex-col divide-y divide-fg-faint border border-fg-faint">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index}
            className={`flex items-center gap-3 p-2.5 text-left transition-colors duration-200 ${
              i === index ? "bg-bg-raised" : "hover:bg-bg-raised/60"
            }`}
          >
            <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-brand-navy sm:h-14 sm:w-20">
              <Image src={item.image!} alt="" fill sizes="80px" className="object-cover" />
              {i === index && <span className="absolute inset-0 border-2 border-accent" />}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block line-clamp-2 text-[12.5px] font-semibold leading-snug ${
                  i === index ? "text-accent" : "text-fg"
                }`}
              >
                {item.title}
              </span>
              <span className="mt-1 block text-[10.5px] text-fg-muted">{item.date}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
