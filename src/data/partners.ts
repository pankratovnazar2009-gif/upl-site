export type Partner = {
  name: string;
  /** Image path — omit to render `name` as a styled wordmark instead. */
  logo?: string;
  role: { uk: string; en: string };
  note: { uk: string; en: string };
};

/**
 * Verified against upl.ua's own announcements (news/view/6342 — PUMA,
 * news/view/11570 — 1+1 media through 2030, news/view/5466 — VBET as title
 * partner) and independent press coverage (BETKING, July 2026) rather than
 * taken at face value. Logos sourced from Wikimedia Commons (freely
 * licensed versions, not Wikipedia's non-free namespace) where available.
 */
export const partners: Partner[] = [
  {
    name: "VBET Україна",
    logo: "/logos/partners/vbet.png",
    role: { uk: "Титульний партнер", en: "Title partner" },
    note: {
      uk: "Підтримує чемпіонат і розвиток українського футболу.",
      en: "Supports the championship and the development of Ukrainian football.",
    },
  },
  {
    name: "BETKING",
    role: { uk: "Стратегічний партнер", en: "Strategic partner" },
    note: {
      uk: "Дворічне партнерство з УПЛ — нагорода «Гравець туру» від BETKING, спільна лінія мерчу та ініціативи відповідальної гри.",
      en: "A two-season partnership with the UPL — the BETKING \"Player of the Round\" award, joint merchandise line and responsible-gambling initiatives.",
    },
  },
  {
    name: "PUMA",
    logo: "/logos/partners/puma.png",
    role: { uk: "Технічний партнер", en: "Technical partner" },
    note: {
      uk: "Офіційний постачальник єдиного м'яча чемпіонату — PUMA Orbita Ball.",
      en: "Official supplier of the league's match ball — the PUMA Orbita Ball.",
    },
  },
  {
    name: "1+1 media",
    logo: "/logos/partners/1plus1.png",
    role: { uk: "Ексклюзивний медіапартнер", en: "Exclusive media partner" },
    note: {
      uk: "Дистриб'ютор трансляцій UPL.TV до 2030 року.",
      en: "Distributes UPL.TV broadcasts through 2030.",
    },
  },
];
