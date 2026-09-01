import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { clubs, getClubBySlug, type Club } from "@/data/clubs";
import { getClubSquad } from "@/lib/transfermarkt-source";
import { getSchedule, getClubRecentMatches, reportIdFromUrl, type ScheduleMatch } from "@/lib/upl-source";
import { scheduleFallback } from "@/data/fallback";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { LegendCard } from "@/components/legend-card";
import { PlayerCard } from "@/components/player-card";

function RecentResultRow({ club, match, locale }: { club: Club; match: ScheduleMatch; locale: "uk" | "en" }) {
  const isHome = match.homeSlug === club.slug;
  const own = isHome ? match.score?.home : match.score?.away;
  const opp = isHome ? match.score?.away : match.score?.home;
  const outcome = own == null || opp == null ? null : own > opp ? "win" : own < opp ? "loss" : "draw";
  const letter = { win: "W", draw: "D", loss: "L" } as const;
  const bg = { win: "bg-state-win", draw: "bg-state-draw", loss: "bg-state-loss" } as const;
  const opponentSlug = isHome ? match.awaySlug : match.homeSlug;
  const opponentClub = opponentSlug ? getClubBySlug(opponentSlug) : undefined;
  const opponentName = opponentClub ? opponentClub.name[locale] : isHome ? match.awayName : match.homeName;
  const reportId = reportIdFromUrl(match.reportUrl);

  const inner = (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold text-white ${outcome ? bg[outcome] : "bg-fg-faint"}`}
      >
        {outcome ? letter[outcome] : "—"}
      </span>
      <span className="flex-1 truncate text-[13.5px] font-medium">
        {isHome ? "vs" : "@"} {opponentName}
      </span>
      <span className="font-display shrink-0 text-[13.5px] font-bold tabular-nums">
        {own}:{opp}
      </span>
      <span className="w-20 shrink-0 text-right text-[11.5px] text-fg-muted">{match.date}</span>
    </div>
  );

  return reportId ? (
    <Link href={`/matches/${reportId}`} className="block transition-colors hover:text-accent">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export const revalidate = 3600;

export function generateStaticParams() {
  return clubs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const club = getClubBySlug(slug);
  if (!club) return {};
  const loc = locale as "uk" | "en";
  return { title: club.name[loc] };
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const club = getClubBySlug(slug);
  if (!club) notFound();

  const locale = (await getLocale()) as "uk" | "en";
  const t = await getTranslations("clubs");
  const name = club.name[locale];
  const squad = await getClubSquad(club.transfermarkt, locale);
  const schedule = (await getSchedule()) ?? scheduleFallback;
  const recentMatches = getClubRecentMatches(schedule.rounds, club.slug, 5);

  const squadGroups = squad
    ? squad.players.reduce<Array<{ label: string; players: typeof squad.players }>>((groups, p) => {
        const last = groups[groups.length - 1];
        if (last && last.label === p.position) last.players.push(p);
        else groups.push({ label: p.position, players: [p] });
        return groups;
      }, [])
    : [];

  const facts: Array<[string, string]> = [
    [t("founded"), club.founded],
    ...(club.refounded ? ([[t("refounded"), club.refounded]] as Array<[string, string]>) : []),
    [t("stadium"), club.stadium],
    [club.leaderRole[locale], club.leaderName],
    [t("coach"), club.coach],
  ];

  return (
    <div className="mx-auto max-w-[900px] px-(--gutter) py-(--section-y-dense)">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-accent"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
        </svg>
        {t("backToClubs")}
      </Link>

      <Reveal className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Image
          src={club.logo}
          alt=""
          width={88}
          height={88}
          className={`h-20 w-20 object-contain sm:h-[88px] sm:w-[88px] ${club.monochromeDark ? "brightness-0 invert" : ""}`}
        />
        <div>
          <p className="text-label uppercase tracking-[0.14em] text-accent">
            {club.city[locale]}
          </p>
          <h1 className="font-display mt-1 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-none">
            {name}
          </h1>
        </div>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-fg-faint pt-8 sm:grid-cols-4"
      >
        {facts.map(([label, value]) => (
          <div key={label}>
            <p className="text-label uppercase tracking-[0.1em] text-fg-muted">
              {label}
            </p>
            <p className="mt-1.5 text-[16px] font-medium">{value}</p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.15} className="mt-10 border-t border-fg-faint pt-8">
        <p className="text-label uppercase tracking-[0.1em] text-fg-muted">
          {t("official")}
        </p>
        <a
          href={`https://${club.officialSite}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-block text-[16px] font-medium text-accent underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
        >
          {club.officialSite} ↗
        </a>
      </Reveal>

      {squadGroups.length > 0 && (
        <Reveal delay={0.2} className="mt-10 border-t border-fg-faint pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[20px] font-bold">{t("squadTitle")}</h2>
            <p className="text-[12px] text-fg-muted">{t("squadSourceNote")}</p>
          </div>
          <div className="mt-6 flex flex-col gap-8">
            {squadGroups.map((group) => (
              <div key={group.label}>
                <p className="text-label uppercase tracking-[0.1em] text-fg-muted">{group.label}</p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {group.players.map((player) => (
                    <PlayerCard key={player.profileUrl} player={player} locale={locale} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {recentMatches.length > 0 && (
        <Reveal delay={0.22} className="mt-10 border-t border-fg-faint pt-8">
          <h2 className="font-display text-[20px] font-bold">{t("recentFormTitle")}</h2>
          <div className="mt-4 flex flex-col divide-y divide-fg-faint/60">
            {recentMatches.map((m, i) => (
              <RecentResultRow key={i} club={club} match={m} locale={locale} />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.25} className="mt-10 border-t border-fg-faint pt-8">
        <h2 className="font-display text-[20px] font-bold">{t("honoursTitle")}</h2>
        {club.honours.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2.5">
            {club.honours.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-fg">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {h[locale]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14.5px] text-fg-muted">{t("noHonours")}</p>
        )}
      </Reveal>

      {club.legends.length > 0 && (
        <Reveal stagger delay={0.25} className="mt-10 border-t border-fg-faint pt-8">
          <h2 className="font-display text-[20px] font-bold">{t("legendsTitle")}</h2>
          <div className="mt-5 flex flex-col gap-5">
            {club.legends.map((legend) => (
              <RevealItem key={legend.name}>
                <LegendCard legend={legend} locale={locale} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
