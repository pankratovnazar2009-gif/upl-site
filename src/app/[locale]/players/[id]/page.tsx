import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPlayerProfile } from "@/lib/upl-source";
import { getClubBySlug } from "@/data/clubs";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 3600;

function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-fg-faint px-4 py-3.5">
      <p className="text-label uppercase tracking-[0.1em] text-fg-muted">{label}</p>
      <p className="font-display mt-1.5 text-[26px] font-bold leading-none tabular-nums">
        {value}
        {hint && <span className="ml-1.5 text-[12px] font-medium text-fg-muted">{hint}</span>}
      </p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = (await getLocale()) as "uk" | "en";
  const player = await getPlayerProfile(Number(id), locale);
  return player ? { title: player.name } : {};
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const locale = (await getLocale()) as "uk" | "en";
  const player = Number.isFinite(numericId) ? await getPlayerProfile(numericId, locale) : null;

  if (!player) notFound();

  const t = await getTranslations("player");
  const club = player.clubSlug ? getClubBySlug(player.clubSlug) : undefined;
  const stats = player.stats;

  const facts: Array<[string, string]> = [
    ...(player.birthDate ? ([[t("birthDate"), player.birthDate]] as Array<[string, string]>) : []),
    ...(player.citizenship ? ([[t("citizenship"), player.citizenship]] as Array<[string, string]>) : []),
    ...(player.height ? ([[t("height"), player.height]] as Array<[string, string]>) : []),
    ...(player.weight ? ([[t("weight"), player.weight]] as Array<[string, string]>) : []),
  ];

  return (
    <div className="mx-auto max-w-[900px] px-(--gutter) py-(--section-y-dense)">
      {club && (
        <Link
          href={`/clubs/${club.slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-accent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
          </svg>
          {t("backToClub")}
        </Link>
      )}

      <Reveal className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden bg-bg-raised sm:w-48">
          {player.photo ? (
            <Image
              src={player.photo}
              alt=""
              fill
              sizes="192px"
              priority
              className="object-cover object-top"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-[36px] font-bold text-fg-faint">
              {player.number ?? "?"}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-label uppercase tracking-[0.14em] text-accent">
            {player.number != null ? `#${player.number} · ` : ""}
            {player.position}
          </p>
          <h1 className="font-display mt-2 text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-tight">
            {player.name}
          </h1>
          {club && (
            <Link
              href={`/clubs/${club.slug}`}
              className="mt-3 inline-flex items-center gap-2.5 text-[14px] font-medium transition-colors hover:text-accent"
            >
              <Image
                src={club.logo}
                alt=""
                width={24}
                height={24}
                className={`h-6 w-6 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
              />
              {club.name[locale]}
            </Link>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 border-t border-fg-faint pt-8">
        <h2 className="font-display text-[20px] font-bold">{t("seasonStats")}</h2>
        {stats && stats.games > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatTile
              label={t("games")}
              value={stats.games}
              hint={stats.starts != null ? `${stats.starts} ${t("starts")}` : undefined}
            />
            <StatTile label={t("minutes")} value={stats.minutes} />
            {stats.cleanSheets != null ? (
              <StatTile label={t("cleanSheets")} value={stats.cleanSheets} />
            ) : (
              <StatTile label={t("goals")} value={stats.goals} />
            )}
            <StatTile label={t("yellows")} value={stats.yellows} />
            <StatTile label={t("reds")} value={stats.reds} />
          </div>
        ) : (
          <p className="mt-4 text-[14.5px] text-fg-muted">{t("noStats")}</p>
        )}
      </Reveal>

      {facts.length > 0 && (
        <Reveal delay={0.15} className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-fg-faint pt-8 sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label}>
              <p className="text-label uppercase tracking-[0.1em] text-fg-muted">{label}</p>
              <p className="mt-1.5 text-[16px] font-medium">{value}</p>
            </div>
          ))}
        </Reveal>
      )}

      <div className="mt-10 flex flex-col gap-2 border-t border-fg-faint pt-6 text-[12px] text-fg-muted">
        <a
          href={player.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline decoration-1 underline-offset-4"
        >
          {t("profileLink")} ↗
        </a>
        <p>{t("sourceNote")}</p>
      </div>
    </div>
  );
}
