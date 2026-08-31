"use client";

import { useState, type ReactNode } from "react";

export function AboutTabs({
  tabs,
}: {
  tabs: { key: string; label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-fg-faint">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`relative px-4 py-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
              active === tab.key ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {tab.label}
            <span
              className={`absolute -bottom-[1px] left-0 h-[2px] bg-accent transition-all duration-300 ${
                active === tab.key ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="pt-10">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
