import * as cheerio from "cheerio";

/**
 * Squad data (position, age, nationality, market value, photo) for each
 * club, scraped from Transfermarkt — upl.ua's own club/player pages don't
 * carry this. Transfermarkt renders every regional domain (.de, .com,
 * .world, …) in the same HTML shape with the same numeric club/player ids,
 * just with localized text — we use transfermarkt.world, which serves
 * Russian-language labels, and translate the small closed set of position/
 * nationality strings ourselves rather than depending on their i18n.
 */

const BASE = "https://www.transfermarkt.world";
const REVALIDATE_SECONDS = 3600; // squads change far less often than live scores

const FETCH_HEADERS = {
  "User-Agent":
    "UPLConceptSite/1.0 (+redesign concept; respectful low-frequency fetch)",
};

async function fetchHtml(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: FETCH_HEADERS,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// Transfermarkt's own 4-way position bucket (the title on the shirt-number
// cell) — coarser than the detailed sub-positions it also renders, but a
// clean, easy-to-translate set for a squad grid.
const POSITION_LABELS: Record<string, { uk: string; en: string }> = {
  Вратарь: { uk: "Воротар", en: "Goalkeeper" },
  Защитник: { uk: "Захисник", en: "Defender" },
  Полузащитник: { uk: "Півзахисник", en: "Midfielder" },
  Нападающий: { uk: "Нападник", en: "Forward" },
};

const POSITION_ORDER = ["Вратарь", "Защитник", "Полузащитник", "Нападающий"];

// Best-effort nationality translation for the flag tooltip — falls back to
// the raw (Russian) name for anything not in this list rather than failing,
// since it's a secondary label, not primary content.
const NATIONALITY_LABELS: Record<string, { uk: string; en: string }> = {
  Украина: { uk: "Україна", en: "Ukraine" },
  Бразилия: { uk: "Бразилія", en: "Brazil" },
  Аргентина: { uk: "Аргентина", en: "Argentina" },
  Венесуэла: { uk: "Венесуела", en: "Venezuela" },
  Уругвай: { uk: "Уругвай", en: "Uruguay" },
  Колумбия: { uk: "Колумбія", en: "Colombia" },
  Эквадор: { uk: "Еквадор", en: "Ecuador" },
  Чили: { uk: "Чилі", en: "Chile" },
  Парагвай: { uk: "Парагвай", en: "Paraguay" },
  Перу: { uk: "Перу", en: "Peru" },
  Испания: { uk: "Іспанія", en: "Spain" },
  Португалия: { uk: "Португалія", en: "Portugal" },
  Италия: { uk: "Італія", en: "Italy" },
  Франция: { uk: "Франція", en: "France" },
  Хорватия: { uk: "Хорватія", en: "Croatia" },
  Сербия: { uk: "Сербія", en: "Serbia" },
  Словакия: { uk: "Словаччина", en: "Slovakia" },
  Словения: { uk: "Словенія", en: "Slovenia" },
  Польша: { uk: "Польща", en: "Poland" },
  Чехия: { uk: "Чехія", en: "Czechia" },
  Румыния: { uk: "Румунія", en: "Romania" },
  Болгария: { uk: "Болгарія", en: "Bulgaria" },
  Венгрия: { uk: "Угорщина", en: "Hungary" },
  Грузия: { uk: "Грузія", en: "Georgia" },
  Молдова: { uk: "Молдова", en: "Moldova" },
  Беларусь: { uk: "Білорусь", en: "Belarus" },
  Нигерия: { uk: "Нігерія", en: "Nigeria" },
  Гана: { uk: "Гана", en: "Ghana" },
  Камерун: { uk: "Камерун", en: "Cameroon" },
  Тунис: { uk: "Туніс", en: "Tunisia" },
  Марокко: { uk: "Марокко", en: "Morocco" },
  Сенегал: { uk: "Сенегал", en: "Senegal" },
  "Кот-д’Ивуар": { uk: "Кот-д’Івуар", en: "Ivory Coast" },
  "Буркина-Фасо": { uk: "Буркіна-Фасо", en: "Burkina Faso" },
  Мали: { uk: "Малі", en: "Mali" },
  Гвинея: { uk: "Гвінея", en: "Guinea" },
  "Демократическая Республика Конго": { uk: "ДР Конго", en: "DR Congo" },
  Конго: { uk: "Конго", en: "Congo" },
  "Сьерра-Леоне": { uk: "Сьєрра-Леоне", en: "Sierra Leone" },
  Того: { uk: "Того", en: "Togo" },
  Замбия: { uk: "Замбія", en: "Zambia" },
  США: { uk: "США", en: "USA" },
  Германия: { uk: "Німеччина", en: "Germany" },
};

function translatePosition(raw: string, locale: "uk" | "en"): string {
  return POSITION_LABELS[raw]?.[locale] ?? raw;
}

function translateNationality(raw: string, locale: "uk" | "en"): string {
  return NATIONALITY_LABELS[raw]?.[locale] ?? raw;
}

/** "5,58 млн €" / "818 тыс €" / "-" -> a plain euro number (or null if unvalued). */
function parseMarketValue(text: string): number | null {
  const m = text.trim().match(/^([\d.,]+)\s*(млн|тыс)?\s*€$/);
  if (!m) return null;
  const num = Number(m[1].replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(num)) return null;
  if (m[2] === "млн") return Math.round(num * 1_000_000);
  if (m[2] === "тыс") return Math.round(num * 1_000);
  return Math.round(num);
}

/** e.g. 5_580_000 -> "€5.6M" (en) / "5,6 млн €" (uk). */
export function formatMarketValue(eur: number, locale: "uk" | "en"): string {
  const millions = eur / 1_000_000;
  const value =
    millions >= 1
      ? `${millions.toLocaleString(locale === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 1 })}${locale === "uk" ? " млн" : "M"}`
      : `${Math.round(eur / 1000).toLocaleString(locale === "uk" ? "uk-UA" : "en-US")}${locale === "uk" ? " тис." : "K"}`;
  return locale === "uk" ? `${value} €` : `€${value}`;
}

export type SquadPlayer = {
  number: number | null;
  name: string;
  profileUrl: string;
  photo: string | null;
  position: string; // already translated
  positionRaw: string; // original Russian key, used for grouping/sorting
  age: number | null;
  nationalities: { name: string; flag: string }[];
  marketValueEUR: number | null;
};

export type ClubSquad = {
  players: SquadPlayer[];
  fetchedAt: string;
  sourceUrl: string;
};

/**
 * A club's current squad. `id`/`slug` are Transfermarkt's own (see
 * `clubs[].transfermarkt` in src/data/clubs.ts) — the slug in the URL
 * barely matters to Transfermarkt (the numeric id after /verein/ is what's
 * authoritative) but we pass the real one anyway rather than relying on that.
 */
export async function getClubSquad(
  tm: { id: number; slug: string },
  locale: "uk" | "en" = "uk",
): Promise<ClubSquad | null> {
  const path = `/${tm.slug}/kader/verein/${tm.id}/saison_id/2026`;
  const html = await fetchHtml(path);
  if (!html) return null;

  const $ = cheerio.load(html);
  const rows = $("table.items > tbody > tr").filter(
    (_, el) => $(el).find(".rueckennummer").length > 0,
  );
  if (rows.length === 0) return null;

  const players: SquadPlayer[] = [];

  rows.each((_, el) => {
    const $row = $(el);
    const positionRaw = $row.find(".rueckennummer").attr("title")?.trim() ?? "";
    const numText = $row.find(".rn_nummer").text().trim();

    const nameLink = $row.find("table.inline-table a[href*='/profil/spieler/']").first();
    const name = nameLink.text().trim();
    const profileHref = nameLink.attr("href") || "";
    if (!name || !profileHref) return;

    const img = $row.find("table.inline-table img").first();
    const photoRaw = img.attr("data-src") || img.attr("src") || "";
    const photo = photoRaw.startsWith("http") ? photoRaw : null;

    // Transfermarkt renders this table two ways depending on which squad-page
    // tab is active — a "collapsed" 5-column one (age embedded in a full DOB
    // string, e.g. "30 янв. 1999 г. (27)") and a "detailed" 6-column one (a
    // bare age number plus a separate contract-expiry column) — same class
    // names either way. Rather than assume a fixed column count, pull age
    // from whichever cell holds it and market value from the last cell,
    // which is that column's terminal position in both layouts.
    const cells = $row.find("> td");
    const ageCellText = $(cells[2]).text().trim();
    const ageMatch = ageCellText.match(/(\d{1,3})\)?\s*$/);

    const nationalities = $(cells[3])
      .find("img.flaggenrahmen")
      .map((__, flagEl) => {
        const $flag = $(flagEl);
        const raw = $flag.attr("title") || $flag.attr("alt") || "";
        return {
          name: translateNationality(raw, locale),
          flag: $flag.attr("src") || "",
        };
      })
      .get();

    const marketValueText = cells.last().text().trim();

    players.push({
      number: numText && numText !== "-" ? Number(numText) : null,
      name,
      profileUrl: `${BASE}${profileHref}`,
      photo,
      position: translatePosition(positionRaw, locale),
      positionRaw,
      age: ageMatch ? Number(ageMatch[1]) : null,
      nationalities,
      marketValueEUR: parseMarketValue(marketValueText),
    });
  });

  if (players.length === 0) return null;

  players.sort(
    (a, b) => POSITION_ORDER.indexOf(a.positionRaw) - POSITION_ORDER.indexOf(b.positionRaw),
  );

  return { players, fetchedAt: new Date().toISOString(), sourceUrl: `${BASE}${path}` };
}
