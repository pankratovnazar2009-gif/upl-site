"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

const SPLITS = ["overall", "home", "away"] as const;
type Split = (typeof SPLITS)[number];

export function StandingsSplitTabs({
  overallSlot,
  homeSlot,
  awaySlot,
}: {
  overallSlot: ReactNode;
  homeSlot: ReactNode;
  awaySlot: ReactNode;
}) {
  const t = useTranslations("standings");
  const [split, setSplit] = useState<Split>("overall");
  const slots: Record<Split, ReactNode> = { overall: overallSlot, home: homeSlot, away: awaySlot };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <div className="flex items-center border border-fg-faint text-label uppercase tracking-[0.08em]">
          {SPLITS.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => setSplit(key)}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
                split === key ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
              } ${i > 0 ? "border-l border-fg-faint" : ""}`}
            >
              {t(`split.${key}`)}
            </button>
          ))}
        </div>
      </div>
      {slots[split]}
    </div>
  );
}
