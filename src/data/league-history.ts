export type TimelineEntry = {
  date: string;
  title: { uk: string; en: string };
  body: { uk: string; en: string };
};

/**
 * Rewritten in our own words from the factual timeline published at
 * upl.ua/ua/pages/about — not a verbatim copy of the source text.
 */
export const leagueTimeline: TimelineEntry[] = [
  {
    date: "2007",
    title: { uk: "Задум", en: "The idea" },
    body: {
      uk: "Власники провідних українських клубів вперше починають обговорювати створення окремої Прем'єр-ліги.",
      en: "Owners of Ukraine's leading clubs first start discussing a separate, self-governed Premier League.",
    },
  },
  {
    date: "15.04.2008",
    title: { uk: "Засновано об'єднання", en: "The association is founded" },
    body: {
      uk: "Керівники клубів топ-ешелону підписують протокол про створення Об'єднання професіональних футбольних клубів України «Прем'єр-ліга».",
      en: "Top-flight club leaders sign the founding protocol of the Association of Ukrainian Professional Football Clubs \"Premier League\".",
    },
  },
  {
    date: "27.05.2008",
    title: { uk: "Старт вирішено на наступний сезон", en: "First season confirmed" },
    body: {
      uk: "Власники клубів ухвалюють рішення стартувати вже в сезоні 2008/09, а не роком пізніше, як планувалось спочатку.",
      en: "Club owners decide to launch already in the 2008/09 season, a year earlier than originally planned.",
    },
  },
  {
    date: "20.06.2008",
    title: { uk: "Членство у ФФУ", en: "Joins the Football Federation" },
    body: {
      uk: "УПЛ стає колективним членом Федерації футболу України; того ж дня підписано угоду про співпрацю з ФФУ.",
      en: "The league becomes a collective member of the Football Federation of Ukraine, with a cooperation agreement signed the same day.",
    },
  },
  {
    date: "2009–2015",
    title: { uk: "Віталій Данілов", en: "Vitaliy Danilov" },
    body: {
      uk: "Обраний президентом УПЛ, переобирався двічі — керує лігою у роки її становлення.",
      en: "Elected league president and re-elected twice, leading the UPL through its formative years.",
    },
  },
  {
    date: "2016",
    title: { uk: "Володимир Генінсон", en: "Volodymyr Geninson" },
    body: {
      uk: "Обраний президентом на звітно-виборних загальних зборах учасників.",
      en: "Elected president at the members' general assembly.",
    },
  },
  {
    date: "2018",
    title: { uk: "Томас Грімм", en: "Thomas Grimm" },
    body: {
      uk: "Стає новим президентом УПЛ; посаду залишає у 2020 році.",
      en: "Becomes the new UPL president, stepping down in 2020.",
    },
  },
  {
    date: "2020",
    title: { uk: "Євген Дикий (в.о.)", en: "Yevhen Dykyi (acting)" },
    body: {
      uk: "Виконує обов'язки президента після відходу Томаса Грімма.",
      en: "Serves as acting president following Thomas Grimm's departure.",
    },
  },
  {
    date: "07.06.2024",
    title: { uk: "Євген Дикий", en: "Yevhen Dykyi" },
    body: {
      uk: "Обраний президентом УПЛ на звітно-виборних загальних зборах — керує лігою й сьогодні.",
      en: "Elected UPL president at the members' general assembly — still leading the league today.",
    },
  },
];

export type LeadershipMember = {
  name: string;
  photo: string;
  role: { uk: string; en: string };
};

export const leadership: LeadershipMember[] = [
  {
    name: "Євген Дикий",
    photo: "/people/dykyi.jpg",
    role: { uk: "Президент", en: "President" },
  },
  {
    name: "Максим Степаненко",
    photo: "/people/stepanenko.jpg",
    role: { uk: "Голова Дирекції, спортивний директор", en: "Head of Directorate, Sporting Director" },
  },
  {
    name: "Максим Радченко",
    photo: "/people/radchenko.jpg",
    role: { uk: "Директор з розвитку УПЛ, керівник УПЛ ТБ", en: "Director of Development, Head of UPL TV" },
  },
  {
    name: "Сергій Бухаленков",
    photo: "/people/bukhalenkov.jpg",
    role: { uk: "Директор Департаменту безпеки та інфраструктури", en: "Director of Security & Infrastructure" },
  },
  {
    name: "Роман Криворучко",
    photo: "/people/kryvoruchko.jpg",
    role: { uk: "Директор Департаменту міжнародних зв'язків та розвитку", en: "Director of International Relations & Development" },
  },
  {
    name: "Валерій Строкач",
    photo: "/people/strokach.jpg",
    role: { uk: "Директор Інформаційно-аналітичного департаменту", en: "Director of Information & Analytics" },
  },
];
