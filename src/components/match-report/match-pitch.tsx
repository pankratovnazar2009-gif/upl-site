import Image from "next/image";
import type { MatchFormationChip } from "@/lib/upl-source";

/** upl.ua falls back to a generic silhouette for players with no headshot on file — treat it as "no photo". */
function hasRealPhoto(url: string | null): url is string {
  return !!url && !url.endsWith("player.png");
}

function Chip({ chip, top }: { chip: MatchFormationChip; top: number }) {
  const photo = hasRealPhoto(chip.photo) ? chip.photo : null;

  return (
    <div
      className="absolute flex w-[64px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 sm:w-[80px]"
      style={{ left: `${chip.x}%`, top: `${top}%` }}
    >
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-bg-raised sm:h-10 sm:w-10">
        {photo ? (
          <Image src={photo} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-[11px] font-bold text-accent sm:text-[12px]">
            {chip.number ?? "?"}
          </span>
        )}
      </div>
      <span className="w-full truncate text-center text-[9.5px] font-semibold leading-tight text-fg drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] sm:text-[11px]">
        {chip.name}
      </span>
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
        <Chip key={`h${i}`} chip={chip} top={chip.y / 2} />
      ))}
      {awayFormation.map((chip, i) => (
        <Chip key={`a${i}`} chip={chip} top={50 + chip.y / 2} />
      ))}
    </div>
  );
}
