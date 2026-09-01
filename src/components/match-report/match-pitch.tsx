import Image from "next/image";
import type { MatchFormationChip } from "@/lib/upl-source";

/** upl.ua falls back to a generic silhouette for players with no headshot on file — treat it as "no photo". */
function hasRealPhoto(url: string | null): url is string {
  return !!url && !url.endsWith("player.png");
}

// Raw x/y from upl.ua run flush to 0%/100% at the pitch's outer edges (a
// keeper drawn at y=0, a winger drawn at x=97) — with a fixed-width chip
// centered on that point via translate(-50%,-50%), that pins it right on
// (or past) the pitch border. Compress the usable drawing area a bit inside
// each edge so every chip — including the two keepers — stays fully inside
// the pitch with room to breathe. The shared halfway line is an internal
// boundary, not a clipped edge, so it's left uncompressed.
const MARGIN_X = 10;
const MARGIN_Y_OUTER = 8;

function insetX(x: number) {
  return MARGIN_X + (x / 100) * (100 - 2 * MARGIN_X);
}

// Identity on the pitch is the shirt number alone — the matching name lives
// in the squad list beside it, so a caption under every one of the 22 chips
// would just repeat that. A photo chip still gets a small number tag pinned
// on its corner so the number reads at a glance either way.
function Chip({ chip, top }: { chip: MatchFormationChip; top: number }) {
  const photo = hasRealPhoto(chip.photo) ? chip.photo : null;

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${insetX(chip.x)}%`, top: `${top}%` }}>
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-bg-raised shadow-[0_1px_5px_rgba(0,0,0,0.45)] sm:h-11 sm:w-11">
        {photo ? (
          <Image src={photo} alt="" fill sizes="44px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-[12px] font-bold text-accent sm:text-[13px]">
            {chip.number ?? "?"}
          </span>
        )}
      </div>
      {photo && chip.number != null && (
        <span className="absolute -bottom-1 -right-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-bg bg-accent px-0.5 font-display text-[9px] font-bold text-accent-fg sm:h-[19px] sm:min-w-[19px] sm:text-[10px]">
          {chip.number}
        </span>
      )}
    </div>
  );
}

/**
 * Two half-pitch formations stacked into one composite diagram — upl.ua
 * publishes each team's XI as x/y percentages within its own half already
 * oriented so both attacking lines meet at the shared halfway line (home's
 * own y grows toward its attack, away's own y grows toward its keeper), so
 * no mirroring is needed: home maps straight onto the top half, away onto
 * the bottom half.
 */
export function MatchPitch({
  homeFormation,
  awayFormation,
  homeName,
  awayName,
}: {
  homeFormation: MatchFormationChip[];
  awayFormation: MatchFormationChip[];
  homeName: string;
  awayName: string;
}) {
  if (homeFormation.length === 0 && awayFormation.length === 0) return null;

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-fg-faint sm:aspect-[4/5]"
      style={{ backgroundImage: "linear-gradient(180deg, #16294f 0%, #0f2040 50%, #16294f 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/12" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 sm:h-28 sm:w-28" />
        <div className="absolute left-1/2 top-0 h-[15%] w-[44%] -translate-x-1/2 border border-t-0 border-white/12" />
        <div className="absolute bottom-0 left-1/2 h-[15%] w-[44%] -translate-x-1/2 border border-b-0 border-white/12" />
        <span className="absolute left-3 top-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white/35">
          {homeName}
        </span>
        <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white/35">
          {awayName}
        </span>
      </div>

      {homeFormation.map((chip, i) => (
        <Chip key={`h${i}`} chip={chip} top={MARGIN_Y_OUTER + (chip.y / 100) * (50 - MARGIN_Y_OUTER)} />
      ))}
      {awayFormation.map((chip, i) => (
        <Chip key={`a${i}`} chip={chip} top={50 + (chip.y / 100) * (50 - MARGIN_Y_OUTER)} />
      ))}
    </div>
  );
}
