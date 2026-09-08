import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { NewsItem } from "@/lib/upl-source";

/**
 * A Premier-League-style news module: the lead story with a row of others
 * under it. Every card is a plain link to the article — clicking one used to
 * swap it into the big slot instead, which meant two clicks to read anything.
 */
export async function FeaturedNews({ items }: { items: NewsItem[] }) {
  const t = await getTranslations("home");
  const slides = items.filter((i) => i.image);

  if (slides.length === 0) return null;
  const [lead, ...rest] = slides;

  return (
    <div className="flex flex-col gap-3">
      {/* On a phone the headline sits under the photo instead of over it — an
          overlay long enough for a four-line title covered the picture. */}
      <a
        href={lead.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden border border-fg-faint bg-brand-navy sm:aspect-[16/9] lg:aspect-[16/8]"
      >
        <div className="img-skeleton relative aspect-[16/10] w-full sm:absolute sm:inset-0 sm:aspect-auto sm:h-full">
          <Image
            src={lead.image!}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/10 to-transparent sm:block" />
        </div>

        <div className="pointer-events-none relative bg-bg-raised p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-7">
          <p className="text-label uppercase tracking-[0.08em] text-fg-muted sm:text-white/70">
            {t("latestNews")} · {lead.date}
          </p>
          <p className="mt-2 max-w-3xl font-display text-lead transition-colors group-hover:text-accent sm:mt-2.5 sm:text-white sm:group-hover:text-accent">
            {lead.title}
          </p>
          {lead.excerpt && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-fg-muted sm:mt-2.5 sm:text-[15px] sm:text-white/70">
              {lead.excerpt}
            </p>
          )}
        </div>
      </a>

      {/* Phones get a swipeable strip rather than a stack of cards — the row
          stays one thumb-flick tall instead of pushing everything else off
          the screen. */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {rest.map((item) => (
          <a
            key={item.id}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[62%] shrink-0 snap-start flex-col border border-fg-faint transition-colors duration-200 hover:border-accent hover:bg-bg-raised/60 sm:w-auto sm:shrink"
          >
            <span className="img-skeleton relative block aspect-[16/10] w-full overflow-hidden">
              <Image
                src={item.image!}
                alt=""
                fill
                sizes="(min-width: 1024px) 18vw, 45vw"
                className="object-cover brightness-[0.9] transition-all duration-300 group-hover:brightness-100"
              />
            </span>
            <span className="flex flex-1 flex-col p-2.5">
              <span className="line-clamp-3 text-[12.5px] font-medium leading-snug transition-colors group-hover:text-accent">
                {item.title}
              </span>
              <span className="mt-auto pt-2 text-label font-normal text-fg-muted">{item.date}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
