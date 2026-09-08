import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getMatchReport,
  getHeadToHead,
  type HeadToHead,
  type MatchReportSide,
  type MatchTeamLineup,
} from "@/lib/upl-source";
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

/** Previous meetings between the two sides — the pre-match context a fixture page is missing. */
function HeadToHeadBlock({
  meetings,
  homeSlug,
  homeName,
  awayName,
  drawsLabel,
}: {
  meetings: HeadToHead["meetings"];
  homeSlug: string;
  homeName: string;
  awayName: string;
  drawsLabel: string;
}) {
  // Tallied over the meetings actually listed, so the numbers never count the
  // fixture you are currently looking at.
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  for (const meeting of meetings) {
    const homeIsThisPageHome = meeting.homeSlug === homeSlug;
    const own = homeIsThisPageHome ? meeting.score.home : meeting.score.away;
    const opp = homeIsThisPageHome ? meeting.score.away : meeting.score.home;
    if (own > opp) homeWins += 1;
    else if (own < opp) awayWins += 1;
    else draws += 1;
  }

  const cells = [
    { value: homeWins, label: homeName },
    { value: draws, label: drawsLabel },
    { value: awayWins, label: awayName },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 border border-fg-faint">
        {cells.map((cell, i) => (
          <div key={i} className={`px-3 py-4 text-center ${i === 1 ? "border-x border-fg-faint" : ""}`}>
            <p className="font-display text-[26px] font-bold leading-none tabular-nums">{cell.value}</p>
            <p className="mt-2 truncate text-[11.5px] text-fg-muted">{cell.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col divide-y divide-fg-faint/60">
        {meetings.map((meeting, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 text-[13px]">
            <span className="w-[70px] shrink-0 text-fg-muted tabular-nums">{meeting.season}</span>
            <span className="min-w-0 flex-1 truncate text-right font-medium">{meeting.homeName}</span>
            <span className="font-display shrink-0 px-2 font-bold tabular-nums">
              {meeting.score.home}:{meeting.score.away}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{meeting.awayName}</span>
            <span className="hidden w-[84px] shrink-0 text-right text-fg-muted tabular-nums sm:block">
              {meeting.date}
            </span>
          </div>
        ))}
      </div>
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
  // upl.ua publishes a report page for every fixture the moment it's
  // scheduled, long before kickoff — it just has no score, lineups, events
  // or officials yet. Detect that case and show a lighter preview instead
  // of a "match report" full of empty sections.
  const hasSquadData =
    report.homeFormation.length > 0 ||
    report.awayFormation.length > 0 ||
    report.homeLineup.starting.length > 0 ||
    report.awayLineup.starting.length > 0;
  const isUpcoming = !report.score;
  const watchLinks = report.broadcasters.filter((b) => b.url);
  const h2h =
    report.home.slug && report.away.slug
      ? await getHeadToHead(report.home.slug, report.away.slug)
      : null;
  const h2hMeetings = h2h?.meetings.filter((m) => m.reportId !== numericId) ?? [];

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

            {isUpcoming && watchLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                {watchLinks.map((channel) => (
                  <a
                    key={channel.name}
                    href={channel.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-live px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-85"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    {t("watchOn", { channel: channel.name })}
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1040px] px-(--gutter) py-(--section-y-dense)">
        {hasSquadData && (
          <Reveal>
            <h2 className="font-display text-[20px] font-bold">{t("formationTitle")}</h2>
            {/* Both squads sit side by side under the pitch on a phone —
                stacked, they were two full screens of names to scroll past. */}
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-[1fr_1.7fr_1fr] lg:items-start lg:gap-6">
              <div className="order-2 col-span-1 lg:order-1">
                <LineupColumn lineup={report.homeLineup} teamName={report.home.name} />
              </div>
              <div className="order-1 col-span-2 lg:order-2 lg:col-span-1">
                <MatchPitch
                  homeFormation={report.homeFormation}
                  awayFormation={report.awayFormation}
                  homeName={report.home.name}
                  awayName={report.away.name}
                />
              </div>
              <div className="order-3 col-span-1 lg:order-3">
                <LineupColumn lineup={report.awayLineup} teamName={report.away.name} />
              </div>
            </div>
          </Reveal>
        )}

        {!hasSquadData && isUpcoming && (
          <Reveal className="border border-fg-faint px-6 py-12 text-center">
            <p className="text-[15px] text-fg-muted">{t("upcomingBody")}</p>
          </Reveal>
        )}

        {h2h && h2hMeetings.length > 0 && (
          <Reveal delay={0.12} className={`${hasSquadData || isUpcoming ? "mt-12 border-t border-fg-faint pt-8" : ""}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-[20px] font-bold">{t("h2hTitle")}</h2>
              <p className="text-[12px] text-fg-muted">{t("h2hNote")}</p>
            </div>
            <div className="mt-5">
              <HeadToHeadBlock
                meetings={h2hMeetings}
                homeSlug={report.home.slug!}
                homeName={report.home.name}
                awayName={report.away.name}
                drawsLabel={t("h2hDraws")}
              />
            </div>
          </Reveal>
        )}

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
            {!isUpcoming && (
              <a href={report.reviewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-1 underline-offset-4">
                {t("reviewLink")} ↗
              </a>
            )}
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
