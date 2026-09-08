import { getTranslations } from "next-intl/server";
import {
  getStandings,
  getSchedule,
  findCurrentRound,
  computeSplitStandings,
  getClubMetrics,
} from "@/lib/upl-source";
import { clubs } from "@/data/clubs";
import { standingsFallback, scheduleFallback } from "@/data/fallback";
import { TeamCompare } from "@/components/team-compare";
import { StandingsTable } from "@/components/standings-table";
import { StandingsSplitTabs } from "@/components/standings-split-tabs";
import { ScheduleBrowser } from "@/components/schedule-browser";
import { TournamentTabs } from "@/components/tournament-tabs";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 300;

export default async function TournamentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("standings");
  const { tab } = await searchParams;

  const [standings, schedule] = await Promise.all([
    getStandings(),
    getSchedule(),
  ]);

  const standingsData = standings ?? standingsFallback;
  const scheduleData = schedule ?? scheduleFallback;
  const currentRound = findCurrentRound(scheduleData.rounds);
  const currentIndex = currentRound
    ? scheduleData.rounds.findIndex((r) => r.round === currentRound.round)
    : 0;

  // Season metrics for every club come straight off the fixtures we already
  // have, so the comparison tab costs no extra requests.
  const metrics = Object.fromEntries(
    clubs.map((club) => [club.slug, getClubMetrics(scheduleData.rounds, club.slug)]),
  );
  const ranked = standingsData.rows.filter((row) => row.slug);
  const defaultA = ranked[0]?.slug ?? clubs[0].slug;
  const defaultB = ranked[1]?.slug ?? clubs[1].slug;

  return (
    <div className="mx-auto max-w-[1000px] px-(--gutter) py-(--section-y-dense)">
      <Reveal>
        <p className="text-label uppercase tracking-[0.14em] text-accent">
          {t("round")} {currentRound?.round ?? ""}
        </p>
        <h1 className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] font-bold">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="mt-12">
        <TournamentTabs
          initialTab={tab === "schedule" ? "schedule" : tab === "compare" ? "compare" : "table"}
          tableSlot={
            <StandingsSplitTabs
              overallSlot={<StandingsTable rows={standingsData.rows} showLegend />}
              homeSlot={<StandingsTable rows={computeSplitStandings(scheduleData.rounds, "home")} zones={false} />}
              awaySlot={<StandingsTable rows={computeSplitStandings(scheduleData.rounds, "away")} zones={false} />}
            />
          }
          scheduleSlot={
            <ScheduleBrowser
              rounds={scheduleData.rounds}
              initialRoundIndex={currentIndex === -1 ? 0 : currentIndex}
            />
          }
          compareSlot={
            <TeamCompare metrics={metrics} defaultA={defaultA} defaultB={defaultB} />
          }
        />
      </div>

      <p className="mt-10 text-[12px] text-fg-muted">{t("sourceNote")}</p>
    </div>
  );
}
