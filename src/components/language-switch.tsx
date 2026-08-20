"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center border border-fg-faint text-label uppercase tracking-[0.12em]">
      {routing.locales.map((loc, i) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale}
          className={`px-2.5 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
            loc === locale
              ? "bg-accent text-accent-fg"
              : "text-fg-muted hover:text-fg"
          } ${i > 0 ? "border-l border-fg-faint" : ""}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
