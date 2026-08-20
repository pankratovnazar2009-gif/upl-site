import type { StandingsResult, ScheduleResult } from "@/lib/upl-source";
import standingsSnapshot from "./standings-snapshot.json";
import scheduleSnapshot from "./schedule-snapshot.json";

/**
 * Static snapshot captured 2026-08-20 (after round 3 of the 2026/27 season)
 * directly from upl.ua. Used only when the live fetch in src/lib/upl-source.ts
 * fails, so the site always has something correct to show instead of an error.
 */
export const SNAPSHOT_TAKEN_AT = "2026-08-20T00:00:00.000Z";

export const standingsFallback: StandingsResult = {
  rows: standingsSnapshot.rows as StandingsResult["rows"],
  seasonId: standingsSnapshot.seasonId,
  fetchedAt: SNAPSHOT_TAKEN_AT,
};

export const scheduleFallback: ScheduleResult = {
  rounds: scheduleSnapshot.rounds as ScheduleResult["rounds"],
  seasonId: scheduleSnapshot.seasonId,
  fetchedAt: SNAPSHOT_TAKEN_AT,
};
