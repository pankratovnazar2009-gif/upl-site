import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getMatchReport, type MatchReportSide, type MatchTeamLineup } from "@/lib/upl-source";
import { Reveal } from "@/components/motion/reveal";
import { MatchPitch } from "@/components/match-report/match-pitch";
import { MatchTimeline } from "@/components/match-report/match-timeline";

export const revalidate = 300;

/** upl.ua publishes "Label: value" for both stats — split on the colon so we can pair the value with our own icon+label instead of the raw source string. */
function afterColon(text: string | null): string | null {
  if (!text) return null;
  const i = text.indexOf(":");
  return i === -1 ? text : text.slice(i + 1).trim();
}

function TeamBlock({ side, align }: { side: MatchReportSide; align: "left" | "right" }) {
  return (
    <div className={`flex flex-1 flex-col items-center gap-3 ${align === "right" ? "sm:items-end" : "sm:items-start"}`}>
      {side.logo && (
        <Image src={side.logo} alt="" width={72} height={72} className="h-14 w-14 object-contain sm:h-[72px] sm:w-[72px]" />
      )}
      <span className="font-display text-center text-[15px] font-bold leading-tight sm:text-right sm:text-[18px]">
        {side.name}
      </span>
    </div>
  );
}

function LineupColumn({ lineup, teamName }: { lineup: MatchTeamLineup; teamName: string }) {
  return (
    <div>
      <p className="text-label uppercase tracking-[0.1em] text-accent">{teamName}</p>
      <p className="mt-3 text-label uppercase tracking-[0.1em] text-fg-muted">{lineup.startingLabel}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {lineup.starting.map((p, i) => (
          <li key={i} className="flex items-baseline gap-2.5 text-[13.5px]">
            <span className="w-5 shrink-0 text-right font-display font-bold tabular-nums text-fg-muted">
              {p.number ?? ""}
            </span>
            <span className="font-medium">{p.name}</span>
          </li>
        ))}
      </ul>

      {(lineup.bench.length > 0 || lineup.coach) && (
        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-label uppercase tracking-[0.1em] text-fg-muted transition-colors hover:text-accent">
            <span className="inline-flex items-center gap-1.5">
              {lineup.benchLabel}
              <span className="text-[10px] transition-transform duration-300 group-open:rotate-45">+</span>
            </span>
          </summary>

          {lineup.bench.length > 0 && (
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {lineup.bench.map((p, i) => (
                <li key={i} className="flex items-baseline gap-2.5 text-[13px] text-fg-muted">
                  <span className="w-5 shrink-0 text-right font-display font-bold tabular-nums">{p.number ?? ""}</span>
                  <span>{p.name}</span>
                </li>
              ))}
            </ul>
          )}

          {lineup.coach && (
            <p className="mt-3 text-[13px] text-fg-muted">
              <span className="text-label uppercase tracking-[0.1em]">{lineup.coachLabel}:</span>{" "}
              <span className="font-medium text-fg">{lineup.coach}</span>
            </p>
          )}
        </details>
      )}
    </div>
  );
}

export default async function MatchReportPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const locale = (await getLocale()) as "uk" | "en";
  const report = Number.isFinite(numericId) ? await getMatchReport(numericId, locale) : null;

  if (!report) notFound();

  const t = await getTranslations("match");
  const ts = await getTranslations("standings");
  const attendance = afterColon(report.attendance);
  const temperature = afterColon(report.temperature);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-fg-faint">
        {report.heroImage && (
          <div className="absolute inset-0">
            <Image src={report.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,32,64,0.55)_0%,rgba(16,32,64,0.97)_100%)]" />
          </div>
        )}

        <div className="relative mx-auto max-w-[900px] px-(--gutter) py-10 sm:py-14">
          <Reveal>
            <Link
              href="/tournament"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-accent"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
              </svg>
              {t("back")}
            </Link>

            <p className="mt-5 text-center text-label uppercase tracking-[0.12em] text-accent">
              {report.round ? `${ts("round")} ${report.round}` : ""}
              {report.matchNumber ? ` · ${t("matchNumber", { number: report.matchNumber })}` : ""}
            </p>

            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
              <TeamBlock side={report.home} align="right" />
              <span className="font-display shrink-0 text-[clamp(2rem,6vw,3.5rem)] font-bold tabular-nums">
                {report.score ? `${report.score.home} : ${report.score.away}` : "—"}
              </span>
              <TeamBlock side={report.away} align="left" />
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-fg-muted">
              {report.time && <span>{report.time}</span>}
              {report.venue && (
                <span>
                  {report.venueUrl ? (
                    <a href={report.venueUrl} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                      {report.venue}
                    </a>
                  ) : (
                    report.venue
                  )}
                </span>
              )}
              {attendance && (
                <span>
                  {t("attendance")}: <span className="font-semibold text-fg">{attendance}</span>
                </span>
              )}
              {temperature && (
                <span>
                  {t("temperature")}: <span className="font-semibold text-fg">{temperature}</span>
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1040px] px-(--gutter) py-(--section-y-dense)">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <h2 className="font-display text-[20px] font-bold">{t("formationTitle")}</h2>
            <div className="mt-5">
              <MatchPitch
                homeFormation={report.homeFormation}
                awayFormation={report.awayFormation}
                homeName={report.home.name}
                awayName={report.away.name}
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-[20px] font-bold">{t("lineupsTitle")}</h2>
            <div className="mt-5 flex flex-col gap-8">
              <LineupColumn lineup={report.homeLineup} teamName={report.home.name} />
              <LineupColumn lineup={report.awayLineup} teamName={report.away.name} />
            </div>
          </Reveal>
        </div>

        {report.events.length > 0 && (
          <Reveal delay={0.15} className="mt-12 border-t border-fg-faint pt-8">
            <h2 className="font-display text-[20px] font-bold">{t("eventsTitle")}</h2>
            <div className="mt-5">
              <MatchTimeline events={report.events} />
            </div>
          </Reveal>
        )}

        {report.officials.length > 0 && (
          <Reveal delay={0.2} className="mt-12 border-t border-fg-faint pt-8">
            <h2 className="font-display text-[20px] font-bold">{t("officialsTitle")}</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {report.officials.map((o, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4 border-t border-fg-faint py-2.5 text-[13.5px]">
                  <span className="text-fg-muted">{o.label}</span>
                  <span className="font-medium">{o.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-12 flex flex-col gap-2 border-t border-fg-faint pt-6 text-[12px] text-fg-muted">
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            <a href={report.previewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-1 underline-offset-4">
              {t("previewLink")} ↗
            </a>
            <a href={report.reviewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-1 underline-offset-4">
              {t("reviewLink")} ↗
            </a>
            <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-1 underline-offset-4">
              {t("fullReportLink")} ↗
            </a>
          </div>
          <p>{t("sourceNote")}</p>
        </div>
      </div>
    </div>
  );
}
