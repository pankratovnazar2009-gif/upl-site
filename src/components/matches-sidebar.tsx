import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import {
  getBroadcastersForMatches,
  getLiveMinute,
  groupMatchesByDate,
  reportIdFromUrl,
  type Broadcaster,
  type ScheduleMatch,
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

function MatchRow({
  match,
  locale,
  liveLabel,
  broadcasters,
}: {
  match: ScheduleMatch;
  locale: "uk" | "en";
  liveLabel: string;
  broadcasters: Broadcaster[];
}) {
  const home = match.homeSlug ? getClubBySlug(match.homeSlug) : undefined;
  const away = match.awaySlug ? getClubBySlug(match.awaySlug) : undefined;
  const reportId = reportIdFromUrl(match.reportUrl);
  const liveMinute = getLiveMinute(match);

  const inner = (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 py-3">
      <div className="flex min-w-0 items-center justify-end gap-2 text-right">
        <span className="truncate text-[13.5px] font-medium">
          {home ? home.name[locale] : match.homeName}
        </span>
        {home && (
          <Image
            src={home.logo}
            alt=""
            width={22}
            height={22}
            className={`h-[22px] w-[22px] shrink-0 object-contain ${home.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
      </div>

      <span className="flex min-w-[52px] justify-center">
        {match.status === "finished" ? (
          <span className="font-display text-[15px] font-bold tabular-nums">
            {match.score?.home}–{match.score?.away}
          </span>
        ) : liveMinute != null ? (
          <LiveBadge minute={liveMinute} label={liveLabel} />
        ) : (
          <span className="text-[12.5px] font-medium tabular-nums text-fg-muted">
            {match.time ?? "—"}
          </span>
        )}
      </span>

      <div className="flex min-w-0 items-center gap-2">
        {away && (
          <Image
            src={away.logo}
            alt=""
            width={22}
            height={22}
            className={`h-[22px] w-[22px] shrink-0 object-contain ${away.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
        <span className="truncate text-[13.5px] font-medium">
          {away ? away.name[locale] : match.awayName}
        </span>
      </div>

      {broadcasters.length > 0 && (
        <div className="col-span-3 -mt-0.5 flex items-center justify-center gap-3">
          {broadcasters.map((b) => (
            <Image
              key={b.name}
              src={b.logo}
              alt={b.name}
              title={b.name}
              width={54}
              height={16}
              className="h-4 w-auto object-contain opacity-70"
            />
          ))}
        </div>
      )}
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

export async function MatchesSidebar({
  matches,
  locale,
}: {
  matches: ScheduleMatch[];
  locale: "uk" | "en";
}) {
  const t = await getTranslations("home");
  const ts = await getTranslations("standings");
  const groups = groupMatchesByDate(matches);
  const broadcasters = await getBroadcastersForMatches(matches);
  const labels = { today: t("today"), tomorrow: t("tomorrow"), yesterday: t("yesterday") };

  return (
    <div className="flex h-full flex-col border border-fg-faint">
      <div className="flex items-center justify-between gap-3 border-b border-fg-faint bg-bg-raised px-4 py-3">
        <span className="text-label uppercase tracking-[0.08em] text-accent">{t("matchesTitle")}</span>
        <Link
          href="/tournament?tab=schedule"
          className="shrink-0 text-[11.5px] font-medium uppercase tracking-[0.06em] text-fg-muted transition-colors hover:text-accent"
        >
          {ts("tabSchedule")} →
        </Link>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 divide-y divide-fg-faint overflow-y-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map(([date, dayMatches]) => (
            <div key={date} className="py-2.5">
              <p className="text-label uppercase tracking-[0.08em] text-fg-muted">
                {dayLabel(date, locale, labels)}
              </p>
              <div className="divide-y divide-fg-faint/60">
                {dayMatches.map((m, i) => (
                  <MatchRow
                    key={i}
                    match={m}
                    locale={locale}
                    liveLabel={ts("live")}
                    broadcasters={broadcasters[reportIdFromUrl(m.reportUrl) ?? -1] ?? []}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </div>
  );
}
