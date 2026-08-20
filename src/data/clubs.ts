export type Legend = {
  name: string;
  years: string;
  note: { uk: string; en: string };
  /** Path in /public/legends/{slug}.jpg — omitted until a real photo is supplied. */
  photo?: string;
};

export type Club = {
  /** URL slug, also the logo filename stem in /public/logos/clubs */
  slug: string;
  /** upl.ua internal club id — /ua/clubs/view/{uplId} */
  uplId: number;
  logo: string;
  /** True for crests with no light/white ink at all (e.g. solid black) — they
   *  need to be force-inverted to white in dark theme or they vanish against
   *  the dark canvas, even outside the monochrome grid contexts. */
  monochromeDark?: boolean;
  city: { uk: string; en: string };
  name: { uk: string; en: string };
  founded: string;
  /** Set only when the current club is a formal revival of an older, dissolved one. */
  refounded?: string;
  leaderRole: { uk: string; en: string };
  leaderName: string;
  coach: string;
  stadium: string;
  officialSite: string;
  /** Empty array is the honest, correct value for clubs with no national titles yet. */
  honours: { uk: string; en: string }[];
  legends: Legend[];
};

export const clubs: Club[] = [
  {
    slug: "bukovyna",
    uplId: 1270,
    logo: "/logos/clubs/bukovyna.png",
    city: { uk: "Чернівці", en: "Chernivtsi" },
    name: { uk: "Буковина", en: "Bukovyna" },
    founded: "1958",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Андрій Сафроняк",
    coach: "Сергій Шищенко",
    stadium: '"Україна" (Чернівці)',
    officialSite: "bukfc.com",
    honours: [],
    legends: [],
  },
  {
    slug: "veres",
    uplId: 1811,
    logo: "/logos/clubs/veres.png",
    city: { uk: "Рівне", en: "Rivne" },
    name: { uk: "Верес", en: "Veres" },
    founded: "1957",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Іван Надєїн",
    coach: "Олег Шандрук",
    stadium: '"Авангард" (Рівне)',
    officialSite: "nkveres.com",
    honours: [
      { uk: "Півфіналіст Кубка України, 1993/94", en: "Ukrainian Cup semi-finalist, 1993/94" },
      { uk: "Переможець Першої ліги, 1992 і 2020/21", en: "First League champions, 1992 and 2020/21" },
    ],
    legends: [
      {
        name: "Володимир Чирков",
        years: "1970s–1980s",
        note: {
          uk: "Найкращий бомбардир в історії клубу — 88 голів, включно з рекордом сезону (25 голів, 1980 рік).",
          en: "Club's all-time top scorer with 88 goals, including a single-season record of 25 goals in 1980.",
        },
      },
    ],
  },
  {
    slug: "dynamo",
    uplId: 7,
    logo: "/logos/clubs/dynamo.png",
    city: { uk: "Київ", en: "Kyiv" },
    name: { uk: "Динамо", en: "Dynamo Kyiv" },
    founded: "1927",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Ігор Суркіс",
    coach: "Ігор Костюк",
    stadium: 'Стадіон "Динамо" ім. В. Лобановського',
    officialSite: "fcdynamo.com",
    honours: [
      { uk: "17-разовий чемпіон України", en: "17-time Ukrainian champions" },
      { uk: "14-разовий володар Кубка України", en: "14-time Ukrainian Cup winners" },
      { uk: "9-разовий володар Суперкубка України", en: "9-time Ukrainian Super Cup winners" },
      { uk: "13-разовий чемпіон СРСР", en: "13-time USSR champions" },
      { uk: "Володар Кубка володарів кубків УЄФА — 1975, 1986", en: "European Cup Winners' Cup — 1975, 1986" },
    ],
    legends: [
      {
        name: "Валерій Лобановський",
        years: "1973–1990, 1997–2002",
        note: {
          uk: "Легендарний тренер, що привів клуб до перемоги в Кубку кубків УЄФА 1975 року й побудував золоту епоху європейського футболу СРСР.",
          en: "Legendary coach who led the club to the 1975 European Cup Winners' Cup and built its golden European era.",
        },
      },
      {
        name: "Олег Блохін",
        years: "1969–1988",
        note: {
          uk: "Володар «Золотого м'яча» 1975 року, символ атакувальної гри «Динамо» тієї епохи.",
          en: "1975 Ballon d'Or winner, symbol of Dynamo's attacking football in that era.",
        },
      },
      {
        name: "Ігор Бєланов",
        years: "1985–1995",
        note: {
          uk: "Володар «Золотого м'яча» 1986 року.",
          en: "1986 Ballon d'Or winner.",
        },
      },
      {
        name: "Андрій Шевченко",
        years: "1994–1999",
        note: {
          uk: "Виріс у зірку світового рівня в «Динамо», перш ніж перейти до «Мілана»; один із найвідоміших українських футболістів в історії.",
          en: "Grew into a world-class striker at Dynamo before his transfer to Milan; one of the most recognisable Ukrainian footballers in history.",
        },
      },
    ],
  },
  {
    slug: "epicentr",
    uplId: 1821,
    logo: "/logos/clubs/epicentr.png",
    city: { uk: "Кам'янець-Подільський", en: "Kamianets-Podilskyi" },
    name: { uk: "Епіцентр", en: "Epicentr" },
    founded: "2020",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Іван Черноног",
    coach: "Сергій Нагорняк",
    stadium: 'Тернопільський міський стадіон ім. Р. Шухевича',
    officialSite: "fcepicentr.com.ua",
    honours: [],
    legends: [],
  },
  {
    slug: "zorya",
    uplId: 11,
    logo: "/logos/clubs/zorya.png",
    city: { uk: "Луганськ", en: "Luhansk" },
    name: { uk: "Зоря", en: "Zorya Luhansk" },
    founded: "1923",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Євген Гєллєр",
    coach: "Віктор Скрипник",
    stadium: 'Стадіон "Динамо" ім. В. Лобановського',
    officialSite: "fczorya.com",
    honours: [
      { uk: "Чемпіон СРСР, 1972", en: "USSR champions, 1972" },
      { uk: "Фіналіст Кубка СРСР, 1974 і 1975", en: "USSR Cup finalists, 1974 and 1975" },
      { uk: "Найкращий результат в УПЛ — 3-тє місце (2016/17, 2019/20, 2020/21, 2022/23)", en: "Best UPL finish — 3rd place (2016/17, 2019/20, 2020/21, 2022/23)" },
    ],
    legends: [
      {
        name: "Йожеф Сабо",
        years: "1970s",
        note: {
          uk: "Ключовий гравець чемпіонського складу 1972 року.",
          en: "Key player of the 1972 championship-winning squad.",
        },
      },
    ],
  },
  {
    slug: "karpaty",
    uplId: 1864,
    logo: "/logos/clubs/karpaty.png",
    city: { uk: "Львів", en: "Lviv" },
    name: { uk: "Карпати", en: "Karpaty Lviv" },
    founded: "1963",
    leaderRole: { uk: "Директор", en: "Director" },
    leaderName: "Андрій Русол",
    coach: "Франсіско Хав'єр Фернандес Діас",
    stadium: '"Україна" (Львів)',
    officialSite: "fckarpaty.org.ua",
    honours: [
      { uk: "Володар Кубка СРСР, 1969 — єдиний клуб поза вищою лігою, що це зробив", en: "USSR Cup winners, 1969 — the only club outside the top division ever to win it" },
      { uk: "Бронза чемпіонату України, 1997/98 — найвище досягнення в незалежній Україні", en: "Ukrainian championship bronze, 1997/98 — the club's best finish in independent Ukraine" },
      { uk: "Фіналіст Кубка України, 1992/93 і 1998/99", en: "Ukrainian Cup finalists, 1992/93 and 1998/99" },
    ],
    legends: [
      {
        name: "Володимир Данилюк",
        years: "1960s–1970s",
        note: {
          uk: "Рекордсмен клубу за кількістю голів — 88, рекорд не побитий і донині.",
          en: "Club's all-time top scorer with 88 goals, a record that still stands.",
        },
      },
      {
        name: "Мирон Маркевич",
        years: "1990s",
        note: {
          uk: "Тренер, що привів «Карпати» до бронзи 1997/98 і двох фіналів Кубка України.",
          en: "The coach behind the 1997/98 bronze medal and two Ukrainian Cup finals.",
        },
      },
    ],
  },
  {
    slug: "kolos",
    uplId: 1806,
    logo: "/logos/clubs/kolos.png",
    monochromeDark: true,
    city: { uk: "Ковалівка", en: "Kovalivka" },
    name: { uk: "Колос", en: "Kolos Kovalivka" },
    founded: "2012",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Андрій Засуха",
    coach: "Руслан Костишин",
    stadium: '"Колос" (Ковалівка)',
    officialSite: "koloskovalivka.com",
    honours: [
      { uk: "Найменше за населенням село в історії України, що мало клуб елітного дивізіону (з 2019 року)", en: "The smallest village ever to field a club in Ukraine's top division (since 2019)" },
      { uk: "Переможець грецького «Аріса» в Лізі Європи УЄФА, 2020/21", en: "Beat Greek side Aris in the UEFA Europa League, 2020/21" },
    ],
    legends: [
      {
        name: "Олександр Бондаренко",
        years: "2016–2021",
        note: {
          uk: "Найкращий бомбардир в історії клубу — 48 голів.",
          en: "Club's all-time top scorer with 48 goals.",
        },
      },
    ],
  },
  {
    slug: "kryvbas",
    uplId: 1478,
    logo: "/logos/clubs/kryvbas.png",
    city: { uk: "Кривий Ріг", en: "Kryvyi Rih" },
    name: { uk: "Кривбас", en: "Kryvbas" },
    founded: "1959",
    refounded: "2020",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Костянтин Караманіц",
    coach: "Патрік Йоханнес ван Леувен",
    stadium: '"Гірник" (Кривий Ріг)',
    officialSite: "fckryvbas.com",
    honours: [
      { uk: "4-разовий чемпіон УРСР — 1971, 1972, 1976, 1981", en: "4-time Ukrainian SSR champions — 1971, 1972, 1976, 1981" },
      { uk: "Бронза чемпіонату України, 1998/99, 1999/2000 (старий клуб) і 2023/24 (сучасний клуб)", en: "Ukrainian championship bronze, 1998/99, 1999/2000 (original club) and 2023/24 (current club)" },
    ],
    legends: [],
  },
  {
    slug: "kudrivka",
    uplId: 1854,
    logo: "/logos/clubs/kudrivka.png",
    city: { uk: "Кудрівка", en: "Kudrivka" },
    name: { uk: "Кудрівка", en: "Kudrivka" },
    founded: "1980",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Роман Солодаренко",
    coach: "Євген Задорожній",
    stadium: '"Авангард"',
    officialSite: "fckudrivka.com",
    honours: [],
    legends: [],
  },
  {
    slug: "livyi-bereh",
    uplId: 1847,
    logo: "/logos/clubs/livyi-bereh.png",
    city: { uk: "Київ", en: "Kyiv" },
    name: { uk: "Лівий Берег", en: "Livyi Bereh" },
    founded: "2017",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Микола Лавренко",
    coach: "Олександр Рябоконь",
    stadium: '"Арена Лівий Берег" (Київ)',
    officialSite: "fclb.com.ua",
    honours: [],
    legends: [],
  },
  {
    slug: "lnz",
    uplId: 1813,
    logo: "/logos/clubs/lnz.png",
    city: { uk: "Черкаси", en: "Cherkasy" },
    name: { uk: "ЛНЗ", en: "LNZ Cherkasy" },
    founded: "2006",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Віктор Кравченко",
    coach: "Віталій Пономарьов",
    stadium: '"Черкаси-Арена"',
    officialSite: "fc-lnz.com",
    honours: [],
    legends: [],
  },
  {
    slug: "obolon",
    uplId: 1565,
    logo: "/logos/clubs/obolon.png",
    city: { uk: "Київ", en: "Kyiv" },
    name: { uk: "Оболонь", en: "Obolon Kyiv" },
    founded: "2013",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Олександр Слободян",
    coach: "Олександр Антоненко",
    stadium: '"Оболонь Арена" (Київ)',
    officialSite: "fc.obolon.ua",
    honours: [],
    legends: [],
  },
  {
    slug: "polissya",
    uplId: 1814,
    logo: "/logos/clubs/polissya.png",
    city: { uk: "Житомир", en: "Zhytomyr" },
    name: { uk: "Полісся", en: "Polissya Zhytomyr" },
    founded: "1959",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Геннадій Буткевич",
    coach: "Руслан Ротань",
    stadium: 'Центральний міський стадіон "Полісся" (Житомир)',
    officialSite: "polissyafc.com",
    honours: [
      { uk: "Чемпіон УРСР, 1967 (як «Автомобіліст»)", en: "Ukrainian SSR champions, 1967 (as \"Avtomobilist\")" },
      { uk: "Володар Кубка УРСР, 1972 і 1990", en: "Ukrainian SSR Cup winners, 1972 and 1990" },
      { uk: "Бронза УПЛ, 2025/26 — перша медаль в історії клубу", en: "UPL bronze, 2025/26 — the club's first-ever medal" },
    ],
    legends: [],
  },
  {
    slug: "kharkiv",
    uplId: 1810,
    logo: "/logos/clubs/kharkiv.png",
    city: { uk: "Харків", en: "Kharkiv" },
    name: { uk: "Харків", en: "FC Kharkiv" },
    founded: "2016",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Богдан Бойко",
    coach: "Младен Бартуловіч",
    stadium: '"Арена Лівий Берег" (Київ)',
    officialSite: "fckharkiv.com",
    honours: [],
    legends: [],
  },
  {
    slug: "chornomorets",
    uplId: 27,
    logo: "/logos/clubs/chornomorets.png",
    city: { uk: "Одеса", en: "Odesa" },
    name: { uk: "Чорноморець", en: "Chornomorets Odesa" },
    founded: "1936",
    leaderRole: { uk: "Директор", en: "Director" },
    leaderName: "Валерій Дєордієв",
    coach: "Роман Григорчук",
    stadium: '"Чорноморець" (Одеса)',
    officialSite: "chornomorets.ua",
    honours: [
      { uk: "Володар Кубка України, 1992 і 1994", en: "Ukrainian Cup winners, 1992 and 1994" },
      { uk: "Срібло чемпіонату України, 1995 і 1996", en: "Ukrainian championship silver, 1995 and 1996" },
      { uk: "Бронза чемпіонату СРСР, 1974", en: "USSR championship bronze, 1974" },
    ],
    legends: [
      {
        name: "Валерій Лобановський",
        years: "1965–1967",
        note: {
          uk: "Перейшов із київського «Динамо»; згодом став одним із найвидатніших тренерів в історії радянського футболу.",
          en: "Joined from Kyiv Dynamo; later became one of the most celebrated coaches in Soviet football history.",
        },
      },
      {
        name: "Ілля Цимбаларь",
        years: "1990s",
        note: {
          uk: "Зірка нападу «золотої» команди Одеси початку 1990-х.",
          en: "Star forward of Odesa's golden-era side of the early 1990s.",
        },
      },
    ],
  },
  {
    slug: "shakhtar",
    uplId: 28,
    logo: "/logos/clubs/shakhtar.png",
    city: { uk: "Донецьк", en: "Donetsk" },
    name: { uk: "Шахтар", en: "Shakhtar Donetsk" },
    founded: "1936",
    leaderRole: { uk: "Президент", en: "President" },
    leaderName: "Рінат Ахметов",
    coach: "Арда Туран",
    stadium: '"Арена Львів"',
    officialSite: "shakhtar.com",
    honours: [
      { uk: "16-разовий чемпіон України", en: "16-time Ukrainian champions" },
      { uk: "15-разовий володар Кубка України", en: "15-time Ukrainian Cup winners" },
      { uk: "9-разовий володар Суперкубка України", en: "9-time Ukrainian Super Cup winners" },
      { uk: "Володар Кубка УЄФА, 2009", en: "UEFA Cup winners, 2009" },
    ],
    legends: [
      {
        name: "Мірча Луческу",
        years: "2004–2016",
        note: {
          uk: "Румунський тренер, що побудував золоту епоху клубу: п'ять чемпіонств і перемога в Кубку УЄФА 2009 року.",
          en: "The Romanian coach who built the club's golden era: five championships and the 2009 UEFA Cup.",
        },
      },
      {
        name: "Дарійо Срна",
        years: "2003–2014",
        note: {
          uk: "Багаторічний капітан, учасник переможного фіналу Кубка УЄФА 2009 року.",
          en: "Long-serving captain, part of the 2009 UEFA Cup-winning squad.",
        },
      },
      {
        name: "Віталій Старухін",
        years: "1970s",
        note: {
          uk: "Найкращий футболіст СРСР 1979 року за версією преси, 26 голів за сезон.",
          en: "Voted USSR's best footballer in 1979 by the Soviet press, with 26 goals that season.",
        },
      },
    ],
  },
];

export function getClubBySlug(slug: string): Club | undefined {
  return clubs.find((c) => c.slug === slug);
}
