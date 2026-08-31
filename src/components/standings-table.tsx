import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import type { StandingsRow } from "@/lib/upl-source";

export async function StandingsTable({
  rows,
  limit,
}: {
  rows: StandingsRow[];
  limit?: number;
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
            const rowContent = (
              <>
                <td className="py-3 pr-2 text-[13px] text-fg-muted">
                  <span
                    className={
                      row.position <= 3
                        ? "text-fg font-semibold"
                        : row.position >= 15
                          ? "text-state-loss"
                          : undefined
                    }
                  >
                    {row.position}
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
    </div>
  );
}
