import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getNews } from "@/lib/upl-source";
import { Reveal, RevealItem } from "@/components/motion/reveal";

export const revalidate = 300;

export default async function NewsPage() {
  const t = await getTranslations("news");
  const news = await getNews(12);

  return (
    <div className="mx-auto max-w-[1100px] px-(--gutter) py-(--section-y-dense)">
      <Reveal>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold">{t("title")}</h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          {t("subtitle")}
        </p>
      </Reveal>

      {news && news.items.length > 0 ? (
        <Reveal
          stagger
          as="ul"
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {news.items.map((item) => (
            <RevealItem key={item.id}>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-bg-raised">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      width={400}
                      height={250}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <p className="mt-4 text-label uppercase tracking-[0.08em] text-fg-muted">
                  {item.date}
                </p>
                <h2 className="mt-1.5 text-[16px] font-semibold leading-snug transition-colors duration-300 group-hover:text-accent">
                  {item.title}
                </h2>
                {item.excerpt && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">
                    {item.excerpt}
                  </p>
                )}
                <span className="mt-3 text-[12px] font-medium uppercase tracking-[0.06em] text-accent">
                  {t("readMore")} ↗
                </span>
              </a>
            </RevealItem>
          ))}
        </Reveal>
      ) : (
        <p className="mt-12 text-[14px] text-fg-muted">{t("subtitle")}</p>
      )}

      <p className="mt-12 border-t border-fg-faint pt-6 text-[12px] text-fg-muted">
        {t("sourceNote")}
      </p>
    </div>
  );
}
