import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStandings, getSchedule, findCurrentRound } from "@/lib/upl-source";
import { standingsFallback, scheduleFallback } from "@/data/fallback";
import { clubs, getClubBySlug } from "@/data/clubs";
import { StandingsTable } from "@/components/standings-table";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";

export const revalidate = 300;

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as "uk" | "en";

  const [standings, schedule] = await Promise.all([getStandings(), getSchedule()]);
  const standingsData = standings ?? standingsFallback;
  const scheduleData = schedule ?? scheduleFallback;
  const currentRound = findCurrentRound(scheduleData.rounds);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-(--gutter) pt-16 pb-(--section-y) sm:pt-24">
        <p className="text-label uppercase tracking-[0.14em] text-accent">
          {t("kicker")}
        </p>
        <SplitHeading
          text={t("heroTitle")}
          className="font-display mt-4 text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95]"
        />
        <Reveal delay={0.35} className="mt-8 max-w-lg">
          <p className="text-[16px] leading-relaxed text-fg-muted">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tournament"
              className="border border-fg bg-fg px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-bg transition-opacity duration-300 hover:opacity-80"
            >
              {t("cta")}
            </Link>
            <Link
              href="/clubs"
              className="border border-fg-faint px-6 py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-fg-faint pt-8 sm:max-w-xl"
        >
          <div>
            <Counter
              to={16}
              className="font-display block text-[clamp(1.75rem,4vw,2.75rem)] font-bold tabular-nums"
            />
            <p className="mt-1 text-[12px] uppercase tracking-[0.06em] text-fg-muted">
              {t("statClubs")}
            </p>
          </div>
          <div>
            <Counter
              to={19}
              className="font-display block text-[clamp(1.75rem,4vw,2.75rem)] font-bold tabular-nums"
            />
            <p className="mt-1 text-[12px] uppercase tracking-[0.06em] text-fg-muted">
              {t("statSeasons")}
            </p>
          </div>
          <div>
            <span className="font-display block text-[clamp(1.75rem,4vw,2.75rem)] font-bold tabular-nums">
              2008
            </span>
            <p className="mt-1 text-[12px] uppercase tracking-[0.06em] text-fg-muted">
              {t("statFounded")}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Standings preview */}
      <section className="border-t border-fg-faint bg-bg-raised">
        <div className="mx-auto max-w-[1000px] px-(--gutter) py-(--section-y-dense)">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold">
                {t("standingsTitle")}
              </h2>
              <p className="mt-2 text-[14px] text-fg-muted">
                {t("standingsSubtitle", { round: (currentRound?.round ?? 1) - 1 || 1 })}
              </p>
            </div>
            <Link
              href="/tournament"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-accent underline decoration-1 underline-offset-4"
            >
              {t("standingsCta")} →
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <StandingsTable rows={standingsData.rows} limit={6} />
          </Reveal>
        </div>
      </section>

      {/* Clubs preview */}
      <section className="border-t border-fg-faint">
        <div className="mx-auto max-w-[1200px] px-(--gutter) py-(--section-y-dense)">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold">
                {t("clubsTitle")}
              </h2>
              <p className="mt-2 text-[14px] text-fg-muted">{t("clubsSubtitle")}</p>
            </div>
            <Link
              href="/clubs"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-accent underline decoration-1 underline-offset-4"
            >
              {t("clubsCta")} →
            </Link>
          </Reveal>

          <Reveal
            stagger
            as="ul"
            className="mt-10 grid grid-cols-4 gap-px border border-fg-faint bg-fg-faint sm:grid-cols-8"
          >
            {clubs.map((club) => (
              <RevealItem key={club.slug} className="bg-bg">
                <Link
                  href={`/clubs/${club.slug}`}
                  className="group flex aspect-square items-center justify-center p-4 transition-colors duration-300 hover:bg-bg-raised"
                  title={club.name[locale]}
                >
                  <Image
                    src={club.logo}
                    alt={club.name[locale]}
                    width={44}
                    height={44}
                    className="h-full w-full max-h-11 max-w-11 object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Next round */}
      {currentRound && (
        <section className="border-t border-fg-faint bg-bg-raised">
          <div className="mx-auto max-w-[900px] px-(--gutter) py-(--section-y-dense)">
            <Reveal>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold">
                {t("nextRound")} · {currentRound.round}
              </h2>
            </Reveal>
            <Reveal
              stagger
              as="ul"
              className="mt-8 flex flex-col divide-y divide-fg-faint border-t border-b border-fg-faint"
            >
              {currentRound.matches.slice(0, 6).map((m, i) => {
                const home = m.homeSlug ? getClubBySlug(m.homeSlug) : undefined;
                const away = m.awaySlug ? getClubBySlug(m.awaySlug) : undefined;
                return (
                  <RevealItem key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4">
                    <div className="flex items-center justify-end gap-2.5 text-right">
                      <span className="truncate text-[14px] font-medium">
                        {home ? home.name[locale] : m.homeName}
                      </span>
                      {home && (
                        <Image src={home.logo} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                      )}
                    </div>
                    <span className="text-[13px] font-medium tabular-nums text-fg-muted">
                      {m.status === "finished" ? `${m.score?.home} : ${m.score?.away}` : m.time ?? "—"}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {away && (
                        <Image src={away.logo} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
                      )}
                      <span className="truncate text-[14px] font-medium">
                        {away ? away.name[locale] : m.awayName}
                      </span>
                    </div>
                  </RevealItem>
                );
              })}
            </Reveal>
          </div>
        </section>
      )}

      {/* About */}
      <section className="border-t border-fg-faint">
        <div className="mx-auto max-w-[720px] px-(--gutter) py-(--section-y)">
          <Reveal>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold">
              {t("aboutTitle")}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-fg-muted">
              {t("aboutBody")}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
