"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getClubBySlug } from "@/data/clubs";
import type { AwardNominee, RoundAwards } from "@/lib/upl-source";

type Category = "player" | "coach";

/**
 * Open vote for the player and coach of the round.
 *
 * There is no ballot server behind the concept site, so a vote is kept in the
 * visitor's own browser and the tallies shown are this browser's vote on top
 * of a deterministic seed — enough to make the interaction real and stable,
 * without pretending to be a league-wide count.
 */
function seededShare(id: string, round: number): number {
  let hash = round * 2654435761;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 40 + (hash % 160); // 40–199 baseline votes
}

function storageKey(round: number, category: Category) {
  return `upl-vote-${category}-${round}`;
}

function NomineeRow({
  nominee,
  votes,
  total,
  voted,
  isChoice,
  onVote,
  detailLabel,
}: {
  nominee: AwardNominee;
  votes: number;
  total: number;
  voted: boolean;
  isChoice: boolean;
  onVote: () => void;
  detailLabel: string;
}) {
  const locale = useLocale() as "uk" | "en";
  const club = nominee.clubSlug ? getClubBySlug(nominee.clubSlug) : undefined;
  const share = total === 0 ? 0 : Math.round((votes / total) * 100);

  return (
    <button
      type="button"
      onClick={onVote}
      disabled={voted}
      className={`group relative w-full overflow-hidden border px-4 py-3 text-left transition-colors ${
        isChoice ? "border-accent" : "border-fg-faint"
      } ${voted ? "cursor-default" : "hover:border-accent"}`}
    >
      {voted && (
        <span
          className="absolute inset-y-0 left-0 bg-accent/12 transition-[width] duration-700"
          style={{ width: `${share}%` }}
        />
      )}

      <span className="relative flex items-center gap-3">
        {club && (
          <Image
            src={club.logo}
            alt=""
            width={26}
            height={26}
            className={`h-[26px] w-[26px] shrink-0 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold">{nominee.name}</span>
          <span className="block truncate text-[11.5px] text-fg-muted">
            {club ? club.name[locale] : nominee.clubName}
            {nominee.detail && ` · ${detailLabel}`}
          </span>
        </span>
        {voted ? (
          <span className="font-display shrink-0 text-[15px] font-bold tabular-nums">{share}%</span>
        ) : (
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] text-fg-muted transition-colors group-hover:text-accent">
            →
          </span>
        )}
      </span>
    </button>
  );
}

export function RoundVote({ awards }: { awards: RoundAwards }) {
  const t = useTranslations("vote");
  const [category, setCategory] = useState<Category>("player");
  const [choice, setChoice] = useState<Record<Category, string | null>>({
    player: null,
    coach: null,
  });

  useEffect(() => {
    setChoice({
      player: localStorage.getItem(storageKey(awards.round, "player")),
      coach: localStorage.getItem(storageKey(awards.round, "coach")),
    });
  }, [awards.round]);

  const nominees = category === "player" ? awards.players : awards.coaches;
  const current = choice[category];

  const tallies = useMemo(() => {
    const base = new Map(nominees.map((n) => [n.id, seededShare(n.id, awards.round)]));
    if (current && base.has(current)) base.set(current, base.get(current)! + 1);
    return base;
  }, [nominees, awards.round, current]);

  const total = Array.from(tallies.values()).reduce((sum, value) => sum + value, 0);

  const vote = (id: string) => {
    if (current) return;
    localStorage.setItem(storageKey(awards.round, category), id);
    setChoice((prev) => ({ ...prev, [category]: id }));
  };

  if (nominees.length === 0) return null;

  return (
    <div className="border border-fg-faint bg-bg-raised px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="font-display text-[19px] font-bold">{t("title")}</h2>
        <p className="text-[12px] uppercase tracking-[0.08em] text-fg-muted">
          {t("roundLabel", { round: awards.round })}
        </p>
      </div>

      <div className="mt-5 flex gap-1 border-b border-fg-faint">
        {(["player", "coach"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`relative px-3 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] transition-colors ${
              category === key ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {key === "player" ? t("tabPlayer") : t("tabCoach")}
            <span
              className={`absolute -bottom-[1px] left-0 h-[2px] bg-accent transition-all duration-300 ${
                category === key ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {nominees.map((nominee) => (
          <NomineeRow
            key={nominee.id}
            nominee={nominee}
            votes={tallies.get(nominee.id) ?? 0}
            total={total}
            voted={Boolean(current)}
            isChoice={current === nominee.id}
            onVote={() => vote(nominee.id)}
            detailLabel={
              category === "player" ? t("goals", { count: Number(nominee.detail) }) : nominee.detail
            }
          />
        ))}
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-fg-muted">
        {current ? t("thanks") : t("hint")}
      </p>
    </div>
  );
}
