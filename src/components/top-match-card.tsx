import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import type { ScheduleMatch } from "@/lib/upl-source";

export async function TopMatchCard({
  round,
  match,
}: {
  round: number;
  match: ScheduleMatch;
}) {
  const t = await getTranslations("home");
  const ts = await getTranslations("standings");
  const locale = (await getLocale()) as "uk" | "en";

  const home = match.homeSlug ? getClubBySlug(match.homeSlug) : undefined;
  const away = match.awaySlug ? getClubBySlug(match.awaySlug) : undefined;
  const stadium = match.status === "scheduled" ? (home?.stadium ?? away?.stadium) : undefined;

  return (
    <div className="flex h-full flex-col border border-fg-faint">
      <div className="flex items-center justify-between border-b border-fg-faint bg-bg-raised px-4 py-2.5">
        <span className="text-label uppercase tracking-[0.08em] text-accent">
          {t("topMatch")} · {ts("round")} {round}
        </span>
        <span className="text-label uppercase tracking-[0.06em] text-fg-muted">
          {match.status === "finished" ? ts("finished") : match.date}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8 text-center">
        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex flex-1 flex-col items-center gap-2">
            {home && (
              <Image
                src={home.logo}
                alt=""
                width={52}
                height={52}
                className={`h-12 w-12 object-contain sm:h-[52px] sm:w-[52px] ${home.monochromeDark ? "dark:brightness-0 dark:invert" : ""}`}
              />
            )}
            <span className="text-[13px] font-semibold leading-tight">
              {home ? home.name[locale] : match.homeName}
            </span>
          </div>

          <span className="font-display shrink-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold tabular-nums">
            {match.status === "finished"
              ? `${match.score?.home} : ${match.score?.away}`
              : (match.time ?? "—")}
          </span>

          <div className="flex flex-1 flex-col items-center gap-2">
            {away && (
              <Image
                src={away.logo}
                alt=""
                width={52}
                height={52}
                className={`h-12 w-12 object-contain sm:h-[52px] sm:w-[52px] ${away.monochromeDark ? "dark:brightness-0 dark:invert" : ""}`}
              />
            )}
            <span className="text-[13px] font-semibold leading-tight">
              {away ? away.name[locale] : match.awayName}
            </span>
          </div>
        </div>

        {stadium && <p className="text-[12px] text-fg-muted">{stadium}</p>}
      </div>

      <Link
        href="/tournament"
        className="border-t border-fg-faint px-4 py-3 text-center text-[12px] font-medium uppercase tracking-[0.06em] text-accent transition-colors hover:bg-bg-raised"
      >
        {t("standingsCta")} →
      </Link>
    </div>
  );
}
