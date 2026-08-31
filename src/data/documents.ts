export type LeagueDocument = {
  title: { uk: string; en: string };
  url: string;
};

export type DocumentFolder = {
  name: { uk: string; en: string };
  items: LeagueDocument[];
};

/**
 * Mirrors the folder structure of upl.ua/ua/pages/docs (Бланки / Нормативні
 * документи) for the current season — every URL verified live (200 OK).
 * The old site's third folder, "Архів" (past seasons), is ~17 more files;
 * we link out to it instead of duplicating it here.
 */
export const documentFolders: DocumentFolder[] = [
  {
    name: { uk: "Бланки", en: "Forms" },
    items: [
      {
        title: { uk: "Рапорт арбітра (УПЛ)", en: "Referee report (UPL)" },
        url: "https://upl.ua/uploads/2307/WjGmKQ_dT9LEbSx-K2OM7E13dnyVyA8X.pdf",
      },
      {
        title: {
          uk: "Рапорт арбітра 2026/27 (Кубок України)",
          en: "Referee report 2026/27 (Ukrainian Cup)",
        },
        url: "https://upl.ua/uploads/2508/NAFuiksNCS25if97Ij2WpvPzH4sc5-md.pdf",
      },
      {
        title: { uk: "Додатковий рапорт арбітра", en: "Supplementary referee report" },
        url: "https://upl.ua/uploads/1706/8yiEktf2Wj0iJ1K_WNZN7Rcst4tgdBxY.pdf",
      },
      {
        title: { uk: "Додаткові технічні місця", en: "Additional technical seating" },
        url: "https://upl.ua/uploads/1703/JorbhR3TMUzadP-XbQnE1ElX7UkygqFI.pdf",
      },
      {
        title: { uk: "Картки замін", en: "Substitution cards" },
        url: "https://upl.ua/uploads/2407/g5rjuhWCKOTE7yG47oijN2xk7fGI5700.pdf",
      },
      {
        title: {
          uk: "Передматчева презентація УПЛ сезону 2026/27",
          en: "Pre-match presentation, 2026/27 season",
        },
        url: "https://upl.ua/uploads/2607/ejg6ZqaWp6pX-KHPQHQstpVytWR8SfIE.pptx",
      },
      {
        title: { uk: "Заявковий лист (футболісти)", en: "Squad list form (players)" },
        url: "https://upl.ua/uploads/2110/VZuU6_GnUBiE4YqgIXJrzKTr64MpA-87.doc",
      },
      {
        title: {
          uk: "Заявковий лист (офіційні представники)",
          en: "Squad list form (team officials)",
        },
        url: "https://upl.ua/uploads/2110/Tu2mubTd0GEAHpb_JPRwunQdRK2jCAeU.doc",
      },
    ],
  },
  {
    name: { uk: "Нормативні документи", en: "Regulations" },
    items: [
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
          uk: "Зміст змін до Правил гри IFAB 2026/27",
          en: "Summary of changes to the IFAB Laws 2026/27",
        },
        url: "https://upl.ua/uploads/2607/skEudM9kKKjkf6L7YnmArI0LkHsqENWB.pdf",
      },
      {
        title: {
          uk: "Додаткові заходи безпеки в умовах воєнного стану, 2026",
          en: "Additional wartime security measures, 2026",
        },
        url: "https://upl.ua/uploads/2607/i3LV1rxHl0TNt1L_QLGYIeBoJeZ5iTbM.pdf",
      },
      {
        title: {
          uk: "Список стадіонів клубів УПЛ сезону 2026/27",
          en: "UPL club stadiums list, 2026/27",
        },
        url: "https://upl.ua/uploads/2607/N1SpdkN-zt7eWsU5SwlQC8_hYn45ofu8.pdf",
      },
      {
        title: {
          uk: "Список стадіонів клубів УПЛ-2 сезону 2026/27",
          en: "UPL-2 club stadiums list, 2026/27",
        },
        url: "https://upl.ua/uploads/2607/ZjX0KuVGfMB5WIoYSWy0bi49YWLD1yzC.pdf",
      },
      {
        title: {
          uk: "Регламент УЄФА з безпеки та правопорядку, 2019",
          en: "UEFA Safety and Security Regulations, 2019",
        },
        url: "https://upl.ua/uploads/1908/rA78kP3mDChUb-E0MUpgdkqQ3l43yWlc.pdf",
      },
      {
        title: {
          uk: "Регламент інфраструктури стадіонів та заходів безпеки УАФ, 2020",
          en: "UAF Stadium Infrastructure & Security Regulations, 2020",
        },
        url: "https://upl.ua/uploads/2002/Da5_5AJwOaQjy3uCJS17lYq7ArM1q2b_.pdf",
      },
      {
        title: { uk: "Медичний регламент УАФ, 2025", en: "UAF Medical Regulations, 2025" },
        url: "https://upl.ua/uploads/2508/cl8aoptYxGzQJfiBLyuk_dq7-zs056gu.pdf",
      },
      {
        title: {
          uk: "Регламент УАФ зі статусу і трансферу футболістів, 2026",
          en: "UAF Player Status & Transfer Regulations, 2026",
        },
        url: "https://upl.ua/uploads/2608/YZXpmYkrJuWa_uxiY0Cv9ywTIdIGocTc.pdf",
      },
      {
        title: {
          uk: "Циркуляр №5 про Регламент УАФ зі статусу і трансферу футболістів, 2026",
          en: "Circular No. 5 on the UAF Transfer Regulations, 2026",
        },
        url: "https://upl.ua/uploads/2608/YMg6bIBuyYnS5LJ24ZzY6HDRPPVeGfmz.pdf",
      },
      {
        title: { uk: "Регламент щодо діяльності агентів, 2026", en: "Agent Regulations, 2026" },
        url: "https://upl.ua/uploads/2608/TLv-qhk_5PyX8h6Pqob3iGzJ3HUg9X_e.pdf",
      },
    ],
  },
];
