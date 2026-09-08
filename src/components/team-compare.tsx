"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { clubs, getClubBySlug } from "@/data/clubs";
import type { ClubMetrics, HeadToHead } from "@/lib/upl-source";

type Row = {
  label: string;
  a: number;
  b: number;
  /** Lower is better (goals conceded, matches without scoring). */
  lowerWins?: boolean;
  format?: (value: number) => string;
};

const oneDecimal = (value: number) => value.toFixed(1);

function ClubPicker({
  value,
  exclude,
  onChange,
  label,
}: {
  value: string;
  exclude: string;
  onChange: (slug: string) => void;
  label: string;
}) {
  const locale = useLocale() as "uk" | "en";
  const club = getClubBySlug(value);

  return (
    <label className="flex min-w-0 flex-1 flex-col items-center gap-3">
      <span className="sr-only">{label}</span>
      {club && (
        <Image
          src={club.logo}
          alt=""
          width={56}
          height={56}
          className={`h-12 w-12 object-contain sm:h-14 sm:w-14 ${club.monochromeDark ? "brightness-0 invert" : ""}`}
        />
      )}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full max-w-[190px] cursor-pointer border border-fg-faint bg-bg-raised px-3 py-2 text-center text-[13px] font-semibold text-fg outline-none transition-colors hover:border-accent focus:border-accent"
      >
        {clubs.map((option) => (
          <option key={option.slug} value={option.slug} disabled={option.slug === exclude}>
            {option.name[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareRow({ row }: { row: Row }) {
  const format = row.format ?? ((value: number) => String(value));
  const total = Math.abs(row.a) + Math.abs(row.b);
  const aShare = total === 0 ? 50 : (Math.abs(row.a) / total) * 100;
  const aBetter = row.lowerWins ? row.a < row.b : row.a > row.b;
  const bBetter = row.lowerWins ? row.b < row.a : row.b > row.a;

  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={`font-display text-[17px] font-bold tabular-nums ${aBetter ? "text-accent" : "text-fg"}`}
        >
          {format(row.a)}
        </span>
        <span className="text-label uppercase tracking-[0.08em] text-fg-muted">{row.label}</span>
        <span
          className={`font-display text-[17px] font-bold tabular-nums ${bBetter ? "text-accent" : "text-fg"}`}
        >
          {format(row.b)}
        </span>
      </div>
      <div className="mt-2 flex h-[5px] w-full gap-[3px] overflow-hidden">
        <div className="flex flex-1 justify-end bg-fg-faint/40">
          <span
            className={aBetter ? "bg-accent" : "bg-fg-muted"}
            style={{ width: `${aShare}%` }}
          />
        </div>
        <div className="flex flex-1 justify-start bg-fg-faint/40">
          <span
            className={bBetter ? "bg-accent" : "bg-fg-muted"}
            style={{ width: `${100 - aShare}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, a, b }: { label: string; a: ClubMetrics["form"]; b: ClubMetrics["form"] }) {
  const dot = (outcome: "win" | "draw" | "loss", key: number) => (
    <span
      key={key}
      className={`h-2.5 w-2.5 rounded-full ${
        outcome === "win" ? "bg-state-win" : outcome === "draw" ? "bg-state-draw" : "bg-state-loss"
      }`}
    />
  );

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="flex gap-1.5">{a.map(dot)}</span>
      <span className="text-label uppercase tracking-[0.08em] text-fg-muted">{label}</span>
      <span className="flex gap-1.5">{b.map(dot)}</span>
    </div>
  );
}

export function TeamCompare({
  metrics,
  defaultA,
  defaultB,
}: {
  metrics: Record<string, ClubMetrics>;
  defaultA: string;
  defaultB: string;
}) {
  const t = useTranslations("compare");
  const locale = useLocale() as "uk" | "en";
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [h2h, setH2h] = useState<HeadToHead | null>(null);
  const [loadingH2h, setLoadingH2h] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingH2h(true);
    fetch(`/api/h2h?a=${a}&b=${b}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HeadToHead | null) => {
        if (!cancelled) {
          setH2h(data);
          setLoadingH2h(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setH2h(null);
          setLoadingH2h(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [a, b]);

  const clubA = getClubBySlug(a);
  const clubB = getClubBySlug(b);
  const mA = metrics[a];
  const mB = metrics[b];

  const rows = useMemo<Row[]>(() => {
    if (!mA || !mB) return [];
    return [
      { label: t("points"), a: mA.points, b: mB.points },
      { label: t("ppg"), a: mA.pointsPerGame, b: mB.pointsPerGame, format: (v) => v.toFixed(2) },
      { label: t("wins"), a: mA.wins, b: mB.wins },
      { label: t("draws"), a: mA.draws, b: mB.draws },
      { label: t("losses"), a: mA.losses, b: mB.losses, lowerWins: true },
      { label: t("goalsFor"), a: mA.goalsFor, b: mB.goalsFor },
      { label: t("goalsAgainst"), a: mA.goalsAgainst, b: mB.goalsAgainst, lowerWins: true },
      { label: t("goalsForPerGame"), a: mA.goalsForPerGame, b: mB.goalsForPerGame, format: oneDecimal },
      {
        label: t("goalsAgainstPerGame"),
        a: mA.goalsAgainstPerGame,
        b: mB.goalsAgainstPerGame,
        lowerWins: true,
        format: oneDecimal,
      },
      { label: t("cleanSheets"), a: mA.cleanSheets, b: mB.cleanSheets },
      { label: t("failedToScore"), a: mA.failedToScore, b: mB.failedToScore, lowerWins: true },
      { label: t("homePoints"), a: mA.homePoints, b: mB.homePoints },
      { label: t("awayPoints"), a: mA.awayPoints, b: mB.awayPoints },
    ];
  }, [mA, mB, t]);

  if (!mA || !mB || !clubA || !clubB) return null;

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-fg-faint pb-7">
        <ClubPicker value={a} exclude={b} onChange={setA} label={t("pickA")} />
        <span className="font-display shrink-0 text-[13px] font-bold uppercase tracking-[0.1em] text-fg-muted">
          vs
        </span>
        <ClubPicker value={b} exclude={a} onChange={setB} label={t("pickB")} />
      </div>

      <div className="mt-2 divide-y divide-fg-faint/60">
        {rows.map((row) => (
          <CompareRow key={row.label} row={row} />
        ))}
        <FormRow label={t("form")} a={mA.form} b={mB.form} />
      </div>

      <div className="mt-10 border-t border-fg-faint pt-8">
        <h3 className="font-display text-[18px] font-bold">{t("h2hTitle")}</h3>

        {loadingH2h ? (
          <p className="mt-3 text-[14px] text-fg-muted">{t("h2hLoading")}</p>
        ) : !h2h || h2h.meetings.length === 0 ? (
          <p className="mt-3 text-[14px] text-fg-muted">{t("h2hEmpty")}</p>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-3 border border-fg-faint">
              {[
                { value: h2h.aWins, label: clubA.name[locale] },
                { value: h2h.draws, label: t("drawsShort") },
                { value: h2h.bWins, label: clubB.name[locale] },
              ].map((cell, i) => (
                <div
                  key={i}
                  className={`px-3 py-4 text-center ${i === 1 ? "border-x border-fg-faint" : ""}`}
                >
                  <p className="font-display text-[26px] font-bold leading-none tabular-nums">
                    {cell.value}
                  </p>
                  <p className="mt-2 truncate text-[11.5px] text-fg-muted">{cell.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col divide-y divide-fg-faint/60">
              {h2h.meetings.map((meeting, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 text-[13px]">
                  <span className="w-[70px] shrink-0 text-fg-muted tabular-nums">{meeting.season}</span>
                  <span className="min-w-0 flex-1 truncate text-right font-medium">
                    {meeting.homeSlug ? getClubBySlug(meeting.homeSlug)?.name[locale] : meeting.homeName}
                  </span>
                  <span className="font-display shrink-0 px-2 font-bold tabular-nums">
                    {meeting.score.home}:{meeting.score.away}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {meeting.awaySlug ? getClubBySlug(meeting.awaySlug)?.name[locale] : meeting.awayName}
                  </span>
                  <span className="hidden w-[84px] shrink-0 text-right text-fg-muted tabular-nums sm:block">
                    {meeting.date}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-[12px] leading-relaxed text-fg-muted">{t("sourceNote")}</p>
    </div>
  );
}
