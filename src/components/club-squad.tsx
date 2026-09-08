"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { UplSquadPlayer } from "@/lib/upl-source";

export type SquadGroup = { label: string; players: UplSquadPlayer[] };

/**
 * The full squad is four position blocks — around 60 players — which is a
 * reasonable grid on a desktop and an endless scroll on a phone. Mobile gets
 * position chips and shows one block at a time; every block is still in the
 * markup, so wider screens (and search engines) see the whole squad.
 */
export function ClubSquad({ groups }: { groups: SquadGroup[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
        {groups.map((group, i) => (
          <button
            key={group.label}
            type="button"
            onClick={() => setActive(i)}
            className={`flex shrink-0 items-center gap-1.5 border px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] transition-colors ${
              i === active ? "border-accent text-accent" : "border-fg-faint text-fg-muted"
            }`}
          >
            {group.label}
            <span className="tabular-nums opacity-70">{group.players.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-8 sm:mt-6">
        {groups.map((group, i) => (
          <div key={group.label} className={i === active ? "" : "hidden sm:block"}>
            <p className="hidden items-baseline gap-2 text-label uppercase tracking-[0.1em] text-fg-muted sm:flex">
              <span className="h-1.5 w-1.5 self-center rounded-full bg-accent" />
              {group.label}
              <span className="tabular-nums">{group.players.length}</span>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:mt-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.players.map((player) => (
                <Link key={player.id} href={`/players/${player.id}`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-raised">
                    {player.photo ? (
                      <Image
                        src={player.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 200px, 45vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-display text-[28px] font-bold text-fg-faint">
                        {player.number ?? "?"}
                      </span>
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
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
