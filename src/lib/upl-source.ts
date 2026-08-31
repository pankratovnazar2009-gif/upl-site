import * as cheerio from "cheerio";
import { clubs } from "@/data/clubs";

/**
 * Server-side live data layer.
 *
 * upl.ua has no public JSON API, but its tournament pages are plain
 * server-rendered HTML (verified by inspecting the raw response — no client
 * JS needed). We fetch and parse those pages here, cached via Next's fetch
 * `revalidate` so we poll upl.ua at most once every few minutes, not per
 * request. On any failure we return null and callers fall back to a static
 * snapshot (see src/data/*-fallback.ts) so the site never shows a broken page.
 */

const BASE = "https://upl.ua";
const FALLBACK_SEASON_ID = 432; // 2026/27 — used only if season-id lookup fails
const REVALIDATE_SECONDS = 300;

const FETCH_HEADERS = {
  "User-Agent":
    "UPLConceptSite/1.0 (+redesign concept; respectful low-frequency fetch)",
};

const uplIdToSlug = new Map(clubs.map((c) => [c.uplId, c.slug]));
const nameToSlug = new Map(clubs.map((c) => [c.name.uk, c.slug]));

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

async function getCurrentSeasonId(): Promise<number> {
  const html = await fetchHtml("/ua/tournaments/games");
  if (!html) return FALLBACK_SEASON_ID;
  const $ = cheerio.load(html);
  const val = $("select[name='id'] option[selected]").attr("value");
  const id = val ? Number(val) : NaN;
  return Number.isFinite(id) ? id : FALLBACK_SEASON_ID;
}

export type StandingsRow = {
  position: number;
  slug: string | null;
  fullName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export type StandingsResult = {
  rows: StandingsRow[];
  fetchedAt: string;
  seasonId: number;
};

export async function getStandings(): Promise<StandingsResult | null> {
  const seasonId = await getCurrentSeasonId();
  const html = await fetchHtml(`/ua/tournaments/championship/${seasonId}/table`);
  if (!html) return null;

  const $ = cheerio.load(html);
  const rows: StandingsRow[] = [];

  $("table.table-num tbody tr").each((_, el) => {
    const tds = $(el).find("td");
    if (tds.length < 10) return;
    const nameLink = $(el).find("a[href^='/ua/clubs/view/']");
    const uplId = Number((nameLink.attr("href") || "").split("/").pop());
    const num = (i: number) => Number($(tds[i]).text().trim()) || 0;

    rows.push({
      position: num(0),
      slug: uplIdToSlug.get(uplId) ?? null,
      fullName: nameLink.text().trim(),
      played: num(2),
      wins: num(3),
      draws: num(4),
      losses: num(5),
      goalsFor: num(6),
      goalsAgainst: num(7),
      goalDiff: num(8),
      points: num(9),
    });
  });

  if (rows.length === 0) return null;
  return { rows, fetchedAt: new Date().toISOString(), seasonId };
}

export type ScheduleMatch = {
  date: string; // DD.MM.YYYY as published
  homeSlug: string | null;
  homeName: string;
  awaySlug: string | null;
  awayName: string;
  status: "finished" | "scheduled";
  score: { home: number; away: number } | null;
  time: string | null;
  reportUrl: string | null;
};

export type ScheduleRound = {
  round: number;
  matches: ScheduleMatch[];
};

export type ScheduleResult = {
  rounds: ScheduleRound[];
  fetchedAt: string;
  seasonId: number;
};

export async function getSchedule(): Promise<ScheduleResult | null> {
  const seasonId = await getCurrentSeasonId();
  const html = await fetchHtml(
    `/ua/tournaments/championship/${seasonId}/calendar`,
  );
  if (!html) return null;

  const $ = cheerio.load(html);
  const rounds: ScheduleRound[] = [];

  $(".table-tour").each((_, tourEl) => {
    const title = $(tourEl).find(".tour-title").text().trim();
    const round = Number((title.match(/(\d+)/) || [])[1]) || 0;
    const matches: ScheduleMatch[] = [];
    let currentDate = "";

    $(tourEl)
      .children()
      .each((_, child) => {
        const $child = $(child);
        if ($child.hasClass("tour-date")) {
          currentDate = $child.text().trim();
          return;
        }
        if (!$child.hasClass("tour-match")) return;

        const homeName = $child.find(".first-team").text().trim();
        const awayName = $child.find(".second-team").text().trim();
        const resultText = $child.find(".resualt a").text().trim();
        const reportHref = $child.find(".resualt a").attr("href") || null;
        // Scores are rendered "2 : 0" (spaces around the colon). Kickoff
        // times are "15:30" (no spaces) — the space is the only thing that
        // reliably tells them apart, since both are otherwise \d+:\d+.
        const scoreMatch = resultText.match(/^(\d+)\s+:\s+(\d+)$/);

        matches.push({
          date: currentDate,
          homeSlug: nameToSlug.get(homeName) ?? null,
          homeName,
          awaySlug: nameToSlug.get(awayName) ?? null,
          awayName,
          status: scoreMatch ? "finished" : "scheduled",
          score: scoreMatch
            ? { home: Number(scoreMatch[1]), away: Number(scoreMatch[2]) }
            : null,
          time: scoreMatch ? null : resultText || null,
          reportUrl: reportHref,
        });
      });

    if (matches.length > 0) rounds.push({ round, matches });
  });

  if (rounds.length === 0) return null;
  return { rounds, fetchedAt: new Date().toISOString(), seasonId };
}

function parseUplDate(date: string): number {
  // "DD.MM.YYYY" -> sortable timestamp. Invalid/missing dates sort last.
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return Number.POSITIVE_INFINITY;
  const [, d, mo, y] = m;
  return Date.UTC(Number(y), Number(mo) - 1, Number(d));
}

/**
 * The round to show by default. Rounds keep their original number even when
 * a single match inside them is postponed to a much later date (this
 * happens on upl.ua — e.g. a round-1 fixture replayed in December) so we
 * can't just take the first round with any "scheduled" match in it. Instead
 * we find the chronologically nearest upcoming match across the whole
 * schedule and use its round.
 */
export function findCurrentRound(rounds: ScheduleRound[]): ScheduleRound | null {
  let best: { round: ScheduleRound; date: number } | null = null;

  for (const round of rounds) {
    for (const match of round.matches) {
      if (match.status !== "scheduled") continue;
      const date = parseUplDate(match.date);
      if (!best || date < best.date) best = { round, date };
    }
  }

  return best?.round ?? rounds[rounds.length - 1] ?? null;
}

/** The chronologically nearest match that hasn't been played yet, anywhere in the schedule. */
export function findNextMatch(
  rounds: ScheduleRound[],
): { match: ScheduleMatch; round: number } | null {
  let best: { match: ScheduleMatch; round: number; date: number } | null = null;

  for (const round of rounds) {
    for (const match of round.matches) {
      if (match.status !== "scheduled") continue;
      const date = parseUplDate(match.date);
      if (!best || date < best.date) best = { match, round: round.round, date };
    }
  }

  return best ? { match: best.match, round: best.round } : null;
}

/**
 * The marquee fixture of a round: the match between the two best-placed
 * clubs in the current table (lowest combined standings position), finished
 * or not. Falls back to the first match if standings are unavailable.
 */
export function findTopMatch(
  round: ScheduleRound,
  standings: StandingsRow[],
): ScheduleMatch | null {
  if (round.matches.length === 0) return null;
  const positionBySlug = new Map(
    standings.filter((r) => r.slug).map((r) => [r.slug as string, r.position]),
  );

  let best: { match: ScheduleMatch; rank: number } | null = null;
  for (const match of round.matches) {
    const homePos = match.homeSlug ? positionBySlug.get(match.homeSlug) : undefined;
    const awayPos = match.awaySlug ? positionBySlug.get(match.awaySlug) : undefined;
    if (homePos === undefined || awayPos === undefined) continue;
    const rank = homePos + awayPos;
    if (!best || rank < best.rank) best = { match, rank };
  }

  return best?.match ?? round.matches[0];
}

export type NewsItem = {
  id: number;
  title: string;
  /** Short lead-in blurb as published — a one-sentence teaser, not the article body. */
  excerpt: string;
  date: string;
  image: string | null;
  sourceUrl: string;
};

export type NewsResult = {
  items: NewsItem[];
  fetchedAt: string;
};

/**
 * Latest headlines. We only ever show upl.ua's own short teaser sentence and
 * link back to the original for the full article — never the article body —
 * to stay well clear of reproducing their editorial content.
 */
export async function getNews(limit = 9): Promise<NewsResult | null> {
  const html = await fetchHtml("/ua/news/index");
  if (!html) return null;

  const $ = cheerio.load(html);
  const items: NewsItem[] = [];

  $(".item-news").each((_, el) => {
    if (items.length >= limit) return;
    const $el = $(el);
    const link = $el.find(".news-title a");
    const href = link.attr("href") || "";
    const id = Number(href.split("/").pop());
    if (!id) return;

    const img = $el.find(".image img").attr("src") || null;

    items.push({
      id,
      title: link.text().trim(),
      excerpt: $el.find(".text").text().trim(),
      date: $el.find(".date").text().trim(),
      image: img ? `${BASE}${img}` : null,
      sourceUrl: `${BASE}${href}`,
    });
  });

  if (items.length === 0) return null;
  return { items, fetchedAt: new Date().toISOString() };
}

/**
 * Same as getNews, but swaps each item's small list thumbnail for the larger
 * ~900x540 lead image published on its own article page — worth the extra
 * fetches only for a handful of "featured" items (e.g. a hero carousel).
 */
export async function getFeaturedNews(count = 3): Promise<NewsItem[] | null> {
  const base = await getNews(count);
  if (!base) return null;

  const withBigImages = await Promise.all(
    base.items.slice(0, count).map(async (item) => {
      const articleHtml = await fetchHtml(`/ua/news/view/${item.id}`);
      if (!articleHtml) return item;
      const $ = cheerio.load(articleHtml);
      const bigImg = $(".top-image-news img").first().attr("src");
      return bigImg ? { ...item, image: `${BASE}${bigImg}` } : item;
    }),
  );

  return withBigImages;
}
