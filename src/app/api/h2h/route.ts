import { getHeadToHead } from "@/lib/upl-source";
import { getClubBySlug } from "@/data/clubs";

/**
 * Head-to-head for a club pair. It lives behind an endpoint rather than in the
 * page payload because it walks several archived season calendars — fetching
 * it only for the pair actually being compared keeps the tournament page fast.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const a = searchParams.get("a") ?? "";
  const b = searchParams.get("b") ?? "";

  if (!getClubBySlug(a) || !getClubBySlug(b) || a === b) {
    return Response.json({ error: "unknown clubs" }, { status: 400 });
  }

  const h2h = await getHeadToHead(a, b);
  return Response.json(h2h, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
