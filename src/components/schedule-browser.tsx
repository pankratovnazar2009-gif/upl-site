"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getClubBySlug } from "@/data/clubs";
import { groupMatchesByDate, reportIdFromUrl, type ScheduleMatch, type ScheduleRound } from "@/lib/upl-source";
import { useLiveMinute } from "@/lib/use-live-minute";
import { LiveBadge } from "@/components/live-badge";

function TeamCell({ slug, name, align }: { slug: string | null; name: string; align: "left" | "right" }) {
  const locale = useLocale();
  const club = slug ? getClubBySlug(slug) : undefined;
  const label = club ? club.name[locale as "uk" | "en"] : name;

  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      {club && (
        <Image
          src={club.logo}
          alt=""
          width={26}
          height={26}
          className={`h-[26px] w-[26px] shrink-0 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
        />
      )}
      <span className="truncate text-[14px] font-medium sm:text-[15px]">{label}</span>
    </div>
  );
}

function ScheduleRow({ match, liveLabel }: { match: ScheduleMatch; liveLabel: string }) {
  const liveMinute = useLiveMinute(match);
  const reportId = reportIdFromUrl(match.reportUrl);

  const inner = (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3.5 sm:gap-6">
      <TeamCell slug={match.homeSlug} name={match.homeName} align="right" />
      <div className="flex min-w-[64px] justify-center">
        {match.status === "finished" ? (
          <span className="font-display text-[16px] font-bold tabular-nums">
            {match.score?.home} : {match.score?.away}
          </span>
        ) : liveMinute != null ? (
          <LiveBadge minute={liveMinute} label={liveLabel} />
        ) : (
          <span className="text-[13px] font-medium tabular-nums text-fg-muted">{match.time ?? "—"}</span>
        )}
      </div>
      <TeamCell slug={match.awaySlug} name={match.awayName} align="left" />
    </div>
  );

  return reportId ? (
    <Link href={`/matches/${reportId}`} className="transition-colors duration-200 hover:bg-bg-raised">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}

type StatusFilter = "all" | "finished" | "scheduled";

function FilterSelect({
  value,
  onChange,
  label,
  className,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-label uppercase tracking-[0.1em] text-fg-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer border border-fg-faint bg-bg-raised px-3 py-2.5 text-[13px] font-medium text-fg outline-none transition-colors hover:border-accent focus:border-accent sm:w-[168px] sm:py-2"
      >
        {children}
      </select>
    </label>
  );
}

export function ScheduleBrowser({
  rounds,
  initialRoundIndex,
}: {
  rounds: ScheduleRound[];
  initialRoundIndex: number;
}) {
  const t = useTranslations("standings");
  const tf = useTranslations("filters");
  const locale = useLocale() as "uk" | "en";
  const [index, setIndex] = useState(
    Math.min(Math.max(initialRoundIndex, 0), rounds.length - 1),
  );
  const [club, setClub] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [month, setMonth] = useState("all");

  const round = rounds[index];

  /**
   * Months present anywhere in the season as "MM.YYYY", in calendar order —
   * postponed fixtures mean the schedule itself is not chronological.
   */
  const months = useMemo(() => {
    const seen = new Set<string>();
    for (const r of rounds) {
      for (const m of r.matches) {
        const key = m.date.slice(3);
        if (key.length === 7) seen.add(key);
      }
    }
    return Array.from(seen).sort((a, b) => {
      const [ma, ya] = a.split(".");
      const [mb, yb] = b.split(".");
      return Number(ya) - Number(yb) || Number(ma) - Number(mb);
    });
  }, [rounds]);

  const clubsInSchedule = useMemo(() => {
    const slugs = new Set<string>();
    for (const r of rounds) {
      for (const m of r.matches) {
        if (m.homeSlug) slugs.add(m.homeSlug);
        if (m.awaySlug) slugs.add(m.awaySlug);
      }
    }
    return Array.from(slugs)
      .map((slug) => ({ slug, name: getClubBySlug(slug)?.name[locale] ?? slug }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rounds, locale]);

  const keep = (match: ScheduleMatch) => {
    if (club !== "all" && match.homeSlug !== club && match.awaySlug !== club) return false;
    if (status !== "all" && match.status !== status) return false;
    if (month !== "all" && match.date.slice(3) !== month) return false;
    return true;
  };

  // A club or date filter is a season-wide question ("when does Dynamo play?"),
  // so it drops the round-by-round pager and lists every match that matches.
  const filtersActive = club !== "all" || status !== "all" || month !== "all";
  const filteredRounds = useMemo(
    () =>
      rounds
        .map((r) => ({ round: r.round, matches: r.matches.filter(keep) }))
        .filter((r) => r.matches.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rounds, club, status, month],
  );
  const total = filteredRounds.reduce((sum, r) => sum + r.matches.length, 0);

  const groups = useMemo(() => (round ? groupMatchesByDate(round.matches) : []), [round]);

  const monthLabel = (key: string) => {
    const [mm, yyyy] = key.split(".");
    const date = new Date(Number(yyyy), Number(mm) - 1, 1);
    const name = date.toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA", {
      month: "long",
      year: "numeric",
    });
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (!round) return null;

  const filterBar = (
    // Three selects side by side leave no room for a club name on a phone, so
    // the club filter takes the full width and the other two share a row.
    <div className="mb-8 grid grid-cols-2 items-end gap-3 sm:flex sm:flex-wrap sm:gap-4">
      <FilterSelect value={club} onChange={setClub} label={tf("club")} className="col-span-2 sm:col-span-1">
        <option value="all">{tf("allClubs")}</option>
        {clubsInSchedule.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect value={month} onChange={setMonth} label={tf("month")}>
        <option value="all">{tf("allDates")}</option>
        {months.map((key) => (
          <option key={key} value={key}>
            {monthLabel(key)}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect value={status} onChange={(value) => setStatus(value as StatusFilter)} label={tf("status")}>
        <option value="all">{tf("allMatches")}</option>
        <option value="scheduled">{tf("upcoming")}</option>
        <option value="finished">{tf("played")}</option>
      </FilterSelect>

      {filtersActive && (
        <button
          type="button"
          onClick={() => {
            setClub("all");
            setStatus("all");
            setMonth("all");
          }}
          className="col-span-2 border border-fg-faint px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-fg-muted transition-colors hover:border-accent hover:text-accent sm:col-span-1 sm:py-2"
        >
          {tf("reset")}
        </button>
      )}
    </div>
  );

  if (filtersActive) {
    return (
      <div>
        {filterBar}
        <p className="mb-6 text-[13px] text-fg-muted">{tf("found", { count: total })}</p>

        {total === 0 ? (
          <p className="border border-fg-faint px-6 py-12 text-center text-[14px] text-fg-muted">
            {tf("empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {filteredRounds.map((r) => (
              <div key={r.round}>
                <p className="mb-3 text-label uppercase tracking-[0.1em] text-fg-muted">
                  {t("round")} {r.round}
                </p>
                <div className="flex flex-col divide-y divide-fg-faint/60">
                  {r.matches.map((m, i) => (
                    <ScheduleRow key={i} match={m} liveLabel={t("live")} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {filterBar}
      <div className="mb-8 flex items-center justify-between border-b border-fg-faint pb-4">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Previous round"
          className="flex h-9 w-9 items-center justify-center border border-fg-faint transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-fg-faint disabled:hover:text-fg"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.04em]">
          {t("round")} {round.round}
        </span>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(rounds.length - 1, i + 1))}
          disabled={index === rounds.length - 1}
          aria-label="Next round"
          className="flex h-9 w-9 items-center justify-center border border-fg-faint transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-fg-faint disabled:hover:text-fg"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map(([date, matches]) => (
          <div key={date}>
            <p className="mb-3 text-label uppercase tracking-[0.1em] text-fg-muted">{date}</p>
            <div className="flex flex-col divide-y divide-fg-faint/60">
              {matches.map((m, i) => (
                <ScheduleRow key={i} match={m} liveLabel={t("live")} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
