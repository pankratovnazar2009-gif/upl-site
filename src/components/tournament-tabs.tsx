"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

export function TournamentTabs({
  tableSlot,
  scheduleSlot,
}: {
  tableSlot: ReactNode;
  scheduleSlot: ReactNode;
}) {
  const t = useTranslations("standings");
  const [tab, setTab] = useState<"table" | "schedule">("table");

  return (
    <div>
      <div className="mb-8 flex gap-1 border-b border-fg-faint">
        {(["table", "schedule"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`relative px-4 py-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
              tab === key ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {key === "table" ? t("tabTable") : t("tabSchedule")}
            <span
              className={`absolute -bottom-[1px] left-0 h-[2px] bg-accent transition-all duration-300 ${
                tab === key ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>
      {tab === "table" ? tableSlot : scheduleSlot}
    </div>
  );
}
