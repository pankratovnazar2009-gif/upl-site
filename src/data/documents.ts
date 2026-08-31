export type LeagueDocument = {
  title: { uk: string; en: string };
  url: string;
};

/**
 * A curated subset of upl.ua/ua/pages/docs — the handful of documents a fan,
 * club official or journalist actually looks for. The full list there also
 * has ~20 more archived/administrative files (past seasons' regulations,
 * referee report forms, agent regulations) we deliberately leave off here.
 */
export const documents: LeagueDocument[] = [
  {
    title: { uk: "Регламент сезону 2026/27", en: "2026/27 Season Regulations" },
    url: "https://upl.ua/uploads/2607/BC2LTfXnNWufbicNdk-XITdz5Foiu84Q.pdf",
  },
  {
    title: { uk: "План-календар сезону 2026/27", en: "2026/27 Season Calendar" },
    url: "https://upl.ua/uploads/2607/edExuvTlpXe35glv2OoL5osnVirBCQnW.pdf",
  },
  {
    title: { uk: "Правила гри IFAB 2026/27", en: "IFAB Laws of the Game 2026/27" },
    url: "https://upl.ua/uploads/2607/QJhJ_G0jC_DjdFgOSEVKNrRjbrKcPY2V.pdf",
  },
  {
    title: {
      uk: "Список стадіонів клубів УПЛ сезону 2026/27",
      en: "UPL club stadiums list, 2026/27 season",
    },
    url: "https://upl.ua/uploads/2607/N1SpdkN-zt7eWsU5SwlQC8_hYn45ofu8.pdf",
  },
];
