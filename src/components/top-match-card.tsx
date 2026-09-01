import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import { getLiveMinute, reportIdFromUrl, type ScheduleMatch } from "@/lib/upl-source";
import { LiveBadge } from "@/components/live-badge";

function MatchRow({
  match,
  locale,
  liveLabel,
  size = "lg",
}: {
  match: ScheduleMatch;
  locale: "uk" | "en";
  liveLabel: string;
  size?: "lg" | "sm";
}) {
  const liveMinute = getLiveMinute(match);
  const home = match.homeSlug ? getClubBySlug(match.homeSlug) : undefined;
  const away = match.awaySlug ? getClubBySlug(match.awaySlug) : undefined;
  const badge = size === "lg" ? 64 : 44;
  const badgeClass = size === "lg" ? "h-12 w-12 sm:h-16 sm:w-16" : "h-9 w-9 sm:h-11 sm:w-11";
  const nameClass = size === "lg" ? "text-[13px] sm:text-[14px]" : "text-[12px] sm:text-[13px]";
  const resultClass =
    size === "lg"
      ? "text-[clamp(1.75rem,4vw,2.75rem)]"
      : "text-[clamp(1.25rem,2.5vw,1.75rem)]";

  return (
    <div className="flex w-full items-center justify-center gap-4 sm:gap-6">
      <div className="flex flex-1 flex-col items-center gap-2">
        {home && (
          <Image
            src={home.logo}
            alt=""
            width={badge}
            height={badge}
            className={`${badgeClass} object-contain ${home.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
        <span className={`${nameClass} font-semibold leading-tight`}>
          {home ? home.name[locale] : match.homeName}
        </span>
      </div>

      <span className={`font-display shrink-0 font-bold tabular-nums ${resultClass}`}>
        {match.status === "finished" ? (
          `${match.score?.home} : ${match.score?.away}`
        ) : liveMinute != null ? (
          <LiveBadge minute={liveMinute} label={liveLabel} />
        ) : (
          (match.time ?? "—")
        )}
      </span>

      <div className="flex flex-1 flex-col items-center gap-2">
        {away && (
          <Image
            src={away.logo}
            alt=""
            width={badge}
            height={badge}
            className={`${badgeClass} object-contain ${away.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
        <span className={`${nameClass} font-semibold leading-tight`}>
          {away ? away.name[locale] : match.awayName}
        </span>
      </div>
    </div>
  );
}

export async function TopMatchCard({
  round,
  match,
  nextMatch,
  nextRound,
}: {
  round: number;
  match: ScheduleMatch;
  nextMatch?: ScheduleMatch | null;
  nextRound?: number;
}) {
  const t = await getTranslations("home");
  const ts = await getTranslations("standings");
  const locale = (await getLocale()) as "uk" | "en";
  const topReportId = reportIdFromUrl(match.reportUrl);
  const nextReportId = nextMatch ? reportIdFromUrl(nextMatch.reportUrl) : null;

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

      {topReportId ? (
        <Link
          href={`/matches/${topReportId}`}
          className="flex flex-1 flex-col items-center justify-center px-6 py-4 text-center transition-colors hover:bg-bg-raised"
        >
          <MatchRow match={match} locale={locale} liveLabel={ts("live")} size="lg" />
        </Link>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-4 text-center">
          <MatchRow match={match} locale={locale} liveLabel={ts("live")} size="lg" />
        </div>
      )}

      {nextMatch && (
        <>
          <div className="flex items-center justify-between border-y border-fg-faint bg-bg-raised px-4 py-2">
            <span className="text-label uppercase tracking-[0.08em] text-fg-muted">
              {t("upNext")}
              {nextRound && nextRound !== round ? ` · ${ts("round")} ${nextRound}` : ""}
            </span>
            <span className="text-label uppercase tracking-[0.06em] text-fg-muted">
              {nextMatch.date}
            </span>
          </div>
          {nextReportId ? (
            <Link
              href={`/matches/${nextReportId}`}
              className="flex flex-col items-center justify-center px-6 py-4 text-center transition-colors hover:bg-bg-raised"
            >
              <MatchRow match={nextMatch} locale={locale} liveLabel={ts("live")} size="sm" />
            </Link>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-4 text-center">
              <MatchRow match={nextMatch} locale={locale} liveLabel={ts("live")} size="sm" />
            </div>
          )}
        </>
      )}

      <Link
        href="/tournament"
        className="mt-auto border-t border-fg-faint px-4 py-3 text-center text-[12px] font-medium uppercase tracking-[0.06em] text-accent transition-colors hover:bg-bg-raised"
      >
        {t("standingsCta")} →
      </Link>
    </div>
  );
}
