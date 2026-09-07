import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import {
  getLiveMinute,
  groupMatchesByDate,
  reportIdFromUrl,
  type ScheduleMatch,
  type ScheduleRound,
} from "@/lib/upl-source";
import { LiveBadge } from "@/components/live-badge";

const WEEKDAY_UK = ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const WEEKDAY_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_UK = ["СІЧ", "ЛЮТ", "БЕР", "КВІ", "ТРА", "ЧЕР", "ЛИП", "СЕР", "ВЕР", "ЖОВ", "ЛИС", "ГРУ"];
const MONTH_EN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function dayLabel(date: string, locale: "uk" | "en", labels: { today: string; tomorrow: string; yesterday: string }) {
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return date;
  const [, d, mo, y] = m;
  const target = new Date(Number(y), Number(mo) - 1, Number(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return labels.today;
  if (diffDays === 1) return labels.tomorrow;
  if (diffDays === -1) return labels.yesterday;

  const weekdays = locale === "uk" ? WEEKDAY_UK : WEEKDAY_EN;
  const months = locale === "uk" ? MONTH_UK : MONTH_EN;
  return `${weekdays[target.getDay()]} ${d} ${months[Number(mo) - 1]}`;
}

function MatchRow({ match, locale, liveLabel }: { match: ScheduleMatch; locale: "uk" | "en"; liveLabel: string }) {
  const home = match.homeSlug ? getClubBySlug(match.homeSlug) : undefined;
  const away = match.awaySlug ? getClubBySlug(match.awaySlug) : undefined;
  const reportId = reportIdFromUrl(match.reportUrl);
  const liveMinute = getLiveMinute(match);

  const inner = (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5">
      <div className="flex min-w-0 items-center justify-end gap-2 text-right">
        <span className="truncate text-[12.5px] font-medium">
          {home ? home.name[locale] : match.homeName}
        </span>
        {home && (
          <Image
            src={home.logo}
            alt=""
            width={18}
            height={18}
            className={`h-[18px] w-[18px] shrink-0 object-contain ${home.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
      </div>

      <span className="flex min-w-[46px] justify-center">
        {match.status === "finished" ? (
          <span className="font-display text-[13px] font-bold tabular-nums">
            {match.score?.home}–{match.score?.away}
          </span>
        ) : liveMinute != null ? (
          <LiveBadge minute={liveMinute} label={liveLabel} />
        ) : (
          <span className="text-[11.5px] font-medium tabular-nums text-fg-muted">
            {match.time ?? "—"}
          </span>
        )}
      </span>

      <div className="flex min-w-0 items-center gap-2">
        {away && (
          <Image
            src={away.logo}
            alt=""
            width={18}
            height={18}
            className={`h-[18px] w-[18px] shrink-0 object-contain ${away.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
        <span className="truncate text-[12.5px] font-medium">
          {away ? away.name[locale] : match.awayName}
        </span>
      </div>
    </div>
  );

  return reportId ? (
    <Link href={`/matches/${reportId}`} className="block transition-colors duration-200 hover:bg-bg">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export async function MatchesSidebar({ round, locale }: { round: ScheduleRound; locale: "uk" | "en" }) {
  const t = await getTranslations("home");
  const ts = await getTranslations("standings");
  const groups = groupMatchesByDate(round.matches);
  const labels = { today: t("today"), tomorrow: t("tomorrow"), yesterday: t("yesterday") };

  return (
    <div className="flex h-full flex-col border border-fg-faint">
      <div className="flex items-center justify-between gap-3 border-b border-fg-faint bg-bg-raised px-4 py-3">
        <span className="text-label uppercase tracking-[0.08em] text-accent">{t("matchesTitle")}</span>
        <Link
          href="/tournament"
          className="shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-fg-muted transition-colors hover:text-accent"
        >
          {t("standingsCta")} →
        </Link>
      </div>

      <div className="flex-1 divide-y divide-fg-faint px-4">
        {groups.map(([date, matches]) => (
          <div key={date} className="py-2.5">
            <p className="text-label uppercase tracking-[0.08em] text-fg-muted">
              {dayLabel(date, locale, labels)}
            </p>
            <div className="divide-y divide-fg-faint/60">
              {matches.map((m, i) => (
                <MatchRow key={i} match={m} locale={locale} liveLabel={ts("live")} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
