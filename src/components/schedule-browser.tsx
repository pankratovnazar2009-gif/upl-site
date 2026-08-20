"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getClubBySlug } from "@/data/clubs";
import type { ScheduleRound } from "@/lib/upl-source";

function groupByDate(round: ScheduleRound) {
  const groups = new Map<string, ScheduleRound["matches"]>();
  for (const m of round.matches) {
    const list = groups.get(m.date) ?? [];
    list.push(m);
    groups.set(m.date, list);
  }
  return Array.from(groups.entries());
}

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
          className="h-[26px] w-[26px] shrink-0 object-contain dark:brightness-0 dark:invert"
        />
      )}
      <span className="truncate text-[14px] font-medium sm:text-[15px]">{label}</span>
    </div>
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
  const [index, setIndex] = useState(
    Math.min(Math.max(initialRoundIndex, 0), rounds.length - 1),
  );
  const round = rounds[index];
  const groups = useMemo(() => (round ? groupByDate(round) : []), [round]);

  if (!round) return null;

  return (
    <div>
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
              {matches.map((m, i) => {
                const inner = (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3.5 sm:gap-6">
                    <TeamCell slug={m.homeSlug} name={m.homeName} align="right" />
                    <div className="flex min-w-[64px] justify-center">
                      {m.status === "finished" ? (
                        <span className="font-display text-[16px] font-bold tabular-nums">
                          {m.score?.home} : {m.score?.away}
                        </span>
                      ) : (
                        <span className="text-[13px] font-medium tabular-nums text-fg-muted">
                          {m.time ?? "—"}
                        </span>
                      )}
                    </div>
                    <TeamCell slug={m.awaySlug} name={m.awayName} align="left" />
                  </div>
                );
                return m.reportUrl ? (
                  <a
                    key={i}
                    href={`https://upl.ua${m.reportUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:bg-bg-raised"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
