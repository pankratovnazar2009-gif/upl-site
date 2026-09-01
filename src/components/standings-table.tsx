import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import type { StandingsRow } from "@/lib/upl-source";

type Zone = "ucl" | "europe" | "playoff" | "relegation";

const ZONE_COLOR: Record<Zone, string> = {
  ucl: "#3b6fd8",
  europe: "#8a3552",
  playoff: "#c9820f",
  relegation: "#c0392b",
};

/**
 * UPL 2026/27 European & relegation slots (verified, not guessed — league
 * champion into UCL Q1, 2nd/3rd into UEL or UECL depending on that season's
 * Cup winner so both share one "Europe" zone here, 13th/14th into the
 * promotion/relegation play-off, 15th/16th relegated outright).
 */
function getZone(position: number, total: number): Zone | null {
  if (position === 1) return "ucl";
  if (position === 2 || position === 3) return "europe";
  const fromBottom = total - position + 1;
  if (fromBottom === 1 || fromBottom === 2) return "relegation";
  if (fromBottom === 3 || fromBottom === 4) return "playoff";
  return null;
}

export async function StandingsTable({
  rows,
  limit,
  showLegend,
  zones = true,
}: {
  rows: StandingsRow[];
  limit?: number;
  showLegend?: boolean;
  /** Position-based zone stripes only make sense for the real overall table — turn them off for a home-only/away-only split. */
  zones?: boolean;
}) {
  const t = await getTranslations("standings");
  const locale = await getLocale();
  const shown = limit ? rows.slice(0, limit) : rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left tabular-nums">
        <thead>
          <tr className="border-b border-fg-faint text-label uppercase tracking-[0.1em] text-fg-muted">
            <th className="w-10 py-3 pr-2 font-medium">{t("colPos")}</th>
            <th className="py-3 pr-2 font-medium">{t("colClub")}</th>
            <th className="w-10 py-3 px-1.5 text-center font-medium">{t("colPlayed")}</th>
            <th className="hidden w-10 py-3 px-1.5 text-center font-medium sm:table-cell">{t("colWins")}</th>
            <th className="hidden w-10 py-3 px-1.5 text-center font-medium sm:table-cell">{t("colDraws")}</th>
            <th className="hidden w-10 py-3 px-1.5 text-center font-medium sm:table-cell">{t("colLosses")}</th>
            <th className="hidden w-16 py-3 px-1.5 text-center font-medium md:table-cell">{t("colGoals")}</th>
            <th className="w-12 py-3 px-1.5 text-center font-medium">{t("colDiff")}</th>
            <th className="w-12 py-3 pl-1.5 text-center font-medium text-fg">{t("colPoints")}</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => {
            const club = row.slug ? getClubBySlug(row.slug) : undefined;
            const displayName = club ? club.name[locale as "uk" | "en"] : row.fullName;
            const zone = zones ? getZone(row.position, rows.length) : null;
            const rowContent = (
              <>
                <td className="py-3 pr-2 text-[13px] text-fg-muted">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-[3px] shrink-0 rounded-[1px]"
                      style={{ backgroundColor: zone ? ZONE_COLOR[zone] : "transparent" }}
                    />
                    <span className={row.position <= 3 ? "text-fg font-semibold" : undefined}>
                      {row.position}
                    </span>
                  </span>
                </td>
                <td className="py-3 pr-2">
                  {club ? (
                    <Link
                      href={`/clubs/${club.slug}`}
                      className="flex items-center gap-2.5 transition-colors duration-200 hover:text-accent"
                    >
                      <Image
                        src={club.logo}
                        alt=""
                        width={22}
                        height={22}
                        className={`h-[22px] w-[22px] shrink-0 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
                      />
                      <span className="truncate text-[14px] font-medium">{displayName}</span>
                    </Link>
                  ) : (
                    <span className="truncate text-[14px] font-medium">{displayName}</span>
                  )}
                </td>
                <td className="px-1.5 py-3 text-center text-[13px] text-fg-muted">{row.played}</td>
                <td className="hidden px-1.5 py-3 text-center text-[13px] text-fg-muted sm:table-cell">{row.wins}</td>
                <td className="hidden px-1.5 py-3 text-center text-[13px] text-fg-muted sm:table-cell">{row.draws}</td>
                <td className="hidden px-1.5 py-3 text-center text-[13px] text-fg-muted sm:table-cell">{row.losses}</td>
                <td className="hidden px-1.5 py-3 text-center text-[13px] text-fg-muted md:table-cell">
                  {row.goalsFor}:{row.goalsAgainst}
                </td>
                <td className="px-1.5 py-3 text-center text-[13px] text-fg-muted">
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </td>
                <td className="pl-1.5 py-3 text-center text-[15px] font-bold text-fg">{row.points}</td>
              </>
            );

            return (
              <tr
                key={row.position}
                className="border-b border-fg-faint/60 transition-colors duration-200 hover:bg-bg-raised"
              >
                {rowContent}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showLegend && (
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-fg-muted">
          {(["ucl", "europe", "playoff", "relegation"] as const).map((zone) => (
            <span key={zone} className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: ZONE_COLOR[zone] }}
              />
              {t(`zone.${zone}`)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
