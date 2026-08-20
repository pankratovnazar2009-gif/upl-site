import { getTranslations } from "next-intl/server";
import { getStandings, getSchedule, findCurrentRound } from "@/lib/upl-source";
import { standingsFallback, scheduleFallback } from "@/data/fallback";
import { StandingsTable } from "@/components/standings-table";
import { ScheduleBrowser } from "@/components/schedule-browser";
import { TournamentTabs } from "@/components/tournament-tabs";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 300;

export default async function TournamentPage() {
  const t = await getTranslations("standings");

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
          tableSlot={<StandingsTable rows={standingsData.rows} />}
          scheduleSlot={
            <ScheduleBrowser
              rounds={scheduleData.rounds}
              initialRoundIndex={currentIndex === -1 ? 0 : currentIndex}
            />
          }
        />
      </div>

      <p className="mt-10 text-[12px] text-fg-muted">{t("sourceNote")}</p>
    </div>
  );
}
