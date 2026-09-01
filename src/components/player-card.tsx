import Image from "next/image";
import { formatMarketValue, type SquadPlayer } from "@/lib/transfermarkt-source";

export function PlayerCard({ player, locale }: { player: SquadPlayer; locale: "uk" | "en" }) {
  const flag = player.nationalities[0];

  return (
    <a
      href={player.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-raised">
        {player.photo ? (
          <Image
            src={player.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-[28px] font-bold text-fg-faint">
            {player.number ?? "?"}
          </div>
        )}
        {player.number != null && (
          <span className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-bg bg-accent px-1 font-display text-[11px] font-bold text-accent-fg">
            {player.number}
          </span>
        )}
      </div>

      <p className="mt-2.5 truncate text-[13px] font-semibold leading-tight transition-colors group-hover:text-accent">
        {player.name}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-fg-muted">
        {flag && (
          <Image src={flag.flag} alt={flag.name} width={16} height={11} className="shrink-0 object-cover" />
        )}
        {player.age != null && <span>{player.age}</span>}
        <span className="ml-auto shrink-0 font-medium text-fg">
          {player.marketValueEUR != null ? formatMarketValue(player.marketValueEUR, locale) : "—"}
        </span>
      </div>
    </a>
  );
}
