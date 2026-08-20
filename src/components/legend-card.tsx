import Image from "next/image";
import type { Legend } from "@/data/clubs";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function LegendCard({ legend, locale }: { legend: Legend; locale: "uk" | "en" }) {
  return (
    <div className="flex gap-4 border-t border-fg-faint pt-5 first:border-t-0 first:pt-0">
      {legend.photo ? (
        <Image
          src={legend.photo}
          alt={legend.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center border border-fg-faint bg-bg-raised font-display text-[15px] font-bold text-fg-muted"
        >
          {initials(legend.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-display text-[15px] font-bold leading-tight">{legend.name}</p>
        <p className="mt-0.5 text-label uppercase tracking-[0.08em] text-fg-muted">
          {legend.years}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">
          {legend.note[locale]}
        </p>
      </div>
    </div>
  );
}
