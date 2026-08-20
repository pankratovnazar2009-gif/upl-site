import { getTranslations, getLocale } from "next-intl/server";
import { leagueTimeline, leadership } from "@/data/league-history";
import { Reveal, RevealItem } from "@/components/motion/reveal";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as "uk" | "en";

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
    </div>
  );
}
