import { getTranslations, getLocale } from "next-intl/server";
import { leagueTimeline, leadership } from "@/data/league-history";
import { documents } from "@/data/documents";
import { getAwardsNews } from "@/lib/upl-source";
import { Reveal, RevealItem } from "@/components/motion/reveal";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as "uk" | "en";
  const awards = await getAwardsNews(3);

  return (
    <div className="mx-auto max-w-[820px] px-(--gutter) py-(--section-y-dense)">
      <Reveal>
        <p className="text-label uppercase tracking-[0.14em] text-accent">2008–2026</p>
        <h1 className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] font-bold">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.04em]">
          {t("timelineTitle")}
        </h2>
        <Reveal stagger as="ul" className="mt-6 flex flex-col">
          {leagueTimeline.map((entry) => (
            <RevealItem
              key={entry.date}
              className="grid grid-cols-[100px_1fr] gap-4 border-t border-fg-faint py-5 sm:grid-cols-[140px_1fr] sm:gap-8"
            >
              <span className="font-display text-[14px] font-bold tabular-nums text-accent">
                {entry.date}
              </span>
              <div>
                <p className="text-[15px] font-semibold">{entry.title[locale]}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">
                  {entry.body[locale]}
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 border-t border-fg-faint pt-10">
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.04em]">
          {t("leadershipTitle")}
        </h2>
        <Reveal
          stagger
          as="ul"
          className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2"
        >
          {leadership.map((person) => (
            <RevealItem key={person.name} className="border-t border-fg-faint pt-4">
              <p className="text-[15px] font-semibold">{person.name}</p>
              <p className="mt-1 text-[13px] text-fg-muted">{person.role[locale]}</p>
            </RevealItem>
          ))}
        </Reveal>
      </Reveal>

      {awards && awards.items.length > 0 && (
        <Reveal delay={0.1} className="mt-16 border-t border-fg-faint pt-10">
          <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.04em]">
            {t("awardsTitle")}
          </h2>
          <p className="mt-2 text-[13.5px] text-fg-muted">{t("awardsSubtitle")}</p>
          <Reveal stagger as="ul" className="mt-6 flex flex-col">
            {awards.items.map((item) => (
              <RevealItem key={item.id} className="border-t border-fg-faint py-4 first:border-t-0">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:text-accent"
                >
                  <p className="text-[12px] tabular-nums text-fg-muted">{item.date}</p>
                  <p className="mt-1 text-[15px] font-semibold leading-snug">{item.title}</p>
                </a>
              </RevealItem>
            ))}
          </Reveal>
        </Reveal>
      )}

      <Reveal delay={0.1} className="mt-16 border-t border-fg-faint pt-10">
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.04em]">
          {t("documentsTitle")}
        </h2>
        <p className="mt-2 text-[13.5px] text-fg-muted">{t("documentsSubtitle")}</p>
        <Reveal stagger as="ul" className="mt-6 flex flex-col">
          {documents.map((doc) => (
            <RevealItem key={doc.url} className="border-t border-fg-faint first:border-t-0">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 py-3.5 text-[14px] font-medium transition-colors hover:text-accent"
              >
                {doc.title[locale]}
                <span className="text-label shrink-0 uppercase tracking-[0.06em] text-fg-muted">
                  PDF ↗
                </span>
              </a>
            </RevealItem>
          ))}
        </Reveal>
        <a
          href="https://upl.ua/ua/pages/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-[12px] font-medium uppercase tracking-[0.06em] text-accent underline decoration-1 underline-offset-4"
        >
          {t("documentsAllLink")} →
        </a>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 border-t border-fg-faint pt-10">
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.04em]">
          {t("contactsTitle")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-label uppercase tracking-[0.1em] text-fg-muted">
              {t("contactsAddress")}
            </p>
            <p className="mt-1.5 text-[15px]">Україна, 04070, м. Київ, вул. Верхній Вал, 72</p>
          </div>
          <div>
            <p className="text-label uppercase tracking-[0.1em] text-fg-muted">
              {t("contactsEmail")}
            </p>
            <a
              href="mailto:info@upl.ua"
              className="mt-1.5 inline-block text-[15px] text-accent transition-opacity hover:opacity-80"
            >
              info@upl.ua
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
