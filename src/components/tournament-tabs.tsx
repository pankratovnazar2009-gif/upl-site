"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type TabKey = "table" | "schedule" | "compare";

export function TournamentTabs({
  tableSlot,
  scheduleSlot,
  compareSlot,
  initialTab = "table",
}: {
  tableSlot: ReactNode;
  scheduleSlot: ReactNode;
  compareSlot: ReactNode;
  /** Lets other pages deep-link straight to a tab (/tournament?tab=schedule). */
  initialTab?: TabKey;
}) {
  const t = useTranslations("standings");
  const [tab, setTab] = useState<TabKey>(initialTab);

  return (
    <div>
      <div className="mb-8 flex gap-1 border-b border-fg-faint">
        {(["table", "schedule", "compare"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`relative px-4 py-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
              tab === key ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {key === "table" ? t("tabTable") : key === "schedule" ? t("tabSchedule") : t("tabCompare")}
            <span
              className={`absolute -bottom-[1px] left-0 h-[2px] bg-accent transition-all duration-300 ${
                tab === key ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>
      {tab === "table" ? tableSlot : tab === "schedule" ? scheduleSlot : compareSlot}
    </div>
  );
}
