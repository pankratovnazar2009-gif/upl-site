export type Partner = {
  name: string;
  role: { uk: string; en: string };
  note: { uk: string; en: string };
};

/**
 * Verified against upl.ua's own announcements (news/view/6342 — PUMA,
 * news/view/11570 — 1+1 media through 2030, news/view/5466 — VBET as title
 * partner) rather than taken at face value.
 */
export const partners: Partner[] = [
  {
    name: "VBET Україна",
    role: { uk: "Титульний партнер", en: "Title partner" },
    note: {
      uk: "Підтримує чемпіонат і розвиток українського футболу.",
      en: "Supports the championship and the development of Ukrainian football.",
    },
  },
  {
    name: "PUMA",
    role: { uk: "Технічний партнер", en: "Technical partner" },
    note: {
      uk: "Офіційний постачальник єдиного м'яча чемпіонату — PUMA Orbita Ball.",
      en: "Official supplier of the league's match ball — the PUMA Orbita Ball.",
    },
  },
  {
    name: "1+1 media",
    role: { uk: "Ексклюзивний медіапартнер", en: "Exclusive media partner" },
    note: {
      uk: "Дистриб'ютор трансляцій UPL.TV до 2030 року.",
      en: "Distributes UPL.TV broadcasts through 2030.",
    },
  },
];
