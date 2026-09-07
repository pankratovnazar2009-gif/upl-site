import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { clubs, getClubBySlug, type Club } from "@/data/clubs";
import {
  getSchedule,
  getClubRecentMatches,
  getClubKits,
  getUplClubSquad,
  type KitSet,
  reportIdFromUrl,
  type ScheduleMatch,
} from "@/lib/upl-source";
import { scheduleFallback } from "@/data/fallback";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { ClubSectionNav, type ClubSection } from "@/components/club-section-nav";
import { LegendCard } from "@/components/legend-card";

function KitStrip({ kit, label }: { kit: KitSet; label: string }) {
  const pieces = [kit.shirt, kit.shorts, kit.socks].filter((src): src is string => Boolean(src));
  if (pieces.length === 0) return null;

  return (
    <div>
      <p className="text-label uppercase tracking-[0.1em] text-fg-muted">{label}</p>
      <div className="mt-2 flex items-end gap-2 border border-fg-faint bg-bg-raised px-3 py-3">
        {pieces.map((src, i) => (
          <div key={i} className="relative h-20 flex-1">
            <Image src={src} alt="" fill sizes="80px" className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Result colours live in globals.css; we need the raw values for tinted chips. */
const OUTCOME_COLOR = { win: "#3f9a55", draw: "#8c96a6", loss: "#e6004c" } as const;

function RecentResultRow({
  club,
  match,
  locale,
  labels,
}: {
  club: Club;
  match: ScheduleMatch;
  locale: "uk" | "en";
  labels: { win: string; draw: string; loss: string; home: string; away: string };
}) {
  const isHome = match.homeSlug === club.slug;
  const own = isHome ? match.score?.home : match.score?.away;
  const opp = isHome ? match.score?.away : match.score?.home;
  const outcome = own == null || opp == null ? null : own > opp ? "win" : own < opp ? "loss" : "draw";
  const opponentSlug = isHome ? match.awaySlug : match.homeSlug;
  const opponentClub = opponentSlug ? getClubBySlug(opponentSlug) : undefined;
  const opponentName = opponentClub ? opponentClub.name[locale] : isHome ? match.awayName : match.homeName;
  const reportId = reportIdFromUrl(match.reportUrl);
  const colour = outcome ? OUTCOME_COLOR[outcome] : "var(--fg-muted)";

  const inner = (
    <div className="flex items-center gap-3 py-3 sm:gap-4">
      {/* Colour rail carries the result at a glance, so the row itself stays clean. */}
      <span className="h-9 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: colour }} />

      {opponentClub ? (
        <Image
          src={opponentClub.logo}
          alt=""
          width={28}
          height={28}
          className={`h-7 w-7 shrink-0 object-contain ${opponentClub.monochromeDark ? "brightness-0 invert" : ""}`}
        />
      ) : (
        <span className="h-7 w-7 shrink-0" />
      )}

      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-[14px] font-semibold">{opponentName}</span>
        <span className="shrink-0 border border-fg-faint px-1.5 py-px text-[10px] font-bold uppercase tracking-[0.06em] text-fg-muted">
          {isHome ? labels.home : labels.away}
        </span>
      </span>

      <span
        className="font-display shrink-0 px-2.5 py-1 text-[14px] font-bold tabular-nums"
        style={{ backgroundColor: `${colour}1f`, color: colour }}
      >
        {own}:{opp}
      </span>

      <span
        className="hidden w-[76px] shrink-0 text-[11px] font-bold uppercase tracking-[0.06em] sm:block"
        style={{ color: colour }}
      >
        {outcome ? labels[outcome] : ""}
      </span>

      <span className="w-[74px] shrink-0 text-right text-[11.5px] text-fg-muted">{match.date}</span>
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
  const squad = await getUplClubSquad(club.uplId, locale);
  const schedule = (await getSchedule()) ?? scheduleFallback;
  const kits = await getClubKits(club.slug, schedule.rounds, locale);
  const recentMatches = getClubRecentMatches(schedule.rounds, club.slug, 5);

  const squadGroups = squad
    ? squad.reduce<Array<{ label: string; players: typeof squad }>>((groups, p) => {
        const group = groups.find((g) => g.label === p.position);
        if (group) group.players.push(p);
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

  const sections: ClubSection[] = [
    { id: "club-about", label: t("navAbout") },
    ...(squadGroups.length > 0 ? [{ id: "club-squad", label: t("navSquad") }] : []),
    ...(kits.home || kits.away ? [{ id: "club-kits", label: t("navKits") }] : []),
    ...(recentMatches.length > 0 ? [{ id: "club-results", label: t("navResults") }] : []),
    { id: "club-honours", label: t("navHonours") },
    ...(club.legends.length > 0 ? [{ id: "club-legends", label: t("navLegends") }] : []),
  ];

  const resultLabels = {
    win: t("resultWin"),
    draw: t("resultDraw"),
    loss: t("resultLoss"),
    home: t("homeShort"),
    away: t("awayShort"),
  };

  return (
    <div>
      <div className="mx-auto max-w-[900px] px-(--gutter) pt-(--section-y-dense)">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-accent"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
        </svg>
        {t("backToClubs")}
      </Link>

      <Reveal className="mb-8 mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
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
      </div>

      <ClubSectionNav sections={sections} />

      <div className="mx-auto max-w-[900px] px-(--gutter) pb-(--section-y-dense)">
      <Reveal
        id="club-about"
        delay={0.1}
        className="grid scroll-mt-32 grid-cols-1 gap-x-8 gap-y-5 border-t border-fg-faint pt-8 sm:grid-cols-4"
      >
        {facts.map(([label, value]) => (
          <div key={label}>
            <p className="text-label uppercase tracking-[0.1em] text-fg-muted">
              {label}
            </p>
            <p className="mt-1.5 text-[16px] font-medium">{value}</p>
          </div>
        ))}
        <div>
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
        </div>
      </Reveal>

      {squadGroups.length === 0 && (
        <div className="mt-10 border-t border-fg-faint pt-8">
          <h2 className="font-display text-[20px] font-bold">{t("squadTitle")}</h2>
          <p className="mt-3 text-[14.5px] text-fg-muted">{t("squadUnavailable")}</p>
        </div>
      )}

      {squadGroups.length > 0 && (
        <Reveal id="club-squad" delay={0.2} className="mt-10 scroll-mt-32 border-t border-fg-faint pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[20px] font-bold">
              {t("squadTitle")}
              <span className="ml-2.5 text-[15px] font-medium text-fg-muted tabular-nums">
                {squad?.length ?? 0}
              </span>
            </h2>
            <p className="text-[12px] text-fg-muted">{t("squadSourceNote")}</p>
          </div>
          <div className="mt-6 flex flex-col gap-8">
            {squadGroups.map((group) => (
              <div key={group.label}>
                <p className="flex items-baseline gap-2 text-label uppercase tracking-[0.1em] text-fg-muted">
                  <span className="h-1.5 w-1.5 self-center rounded-full bg-accent" />
                  {group.label}
                  <span className="tabular-nums">{group.players.length}</span>
                </p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
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
        </Reveal>
      )}

      {(kits.home || kits.away) && (
        <Reveal id="club-kits" delay={0.21} className="mt-10 scroll-mt-32 border-t border-fg-faint pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[20px] font-bold">{t("kitsTitle")}</h2>
            <p className="text-[12px] text-fg-muted">{t("kitsSourceNote")}</p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {kits.home && <KitStrip kit={kits.home.outfield} label={t("kitHome")} />}
            {kits.away && <KitStrip kit={kits.away.outfield} label={t("kitAway")} />}
            {kits.home && (
              <KitStrip kit={kits.home.keeper} label={`${t("kitKeeper")} · ${t("kitHome")}`} />
            )}
            {kits.away && (
              <KitStrip kit={kits.away.keeper} label={`${t("kitKeeper")} · ${t("kitAway")}`} />
            )}
          </div>
        </Reveal>
      )}

      {recentMatches.length > 0 && (
        <Reveal id="club-results" delay={0.22} className="mt-10 scroll-mt-32 border-t border-fg-faint pt-8">
          <h2 className="font-display text-[20px] font-bold">{t("recentFormTitle")}</h2>
          <div className="mt-4 flex flex-col divide-y divide-fg-faint/60">
            {recentMatches.map((m, i) => (
              <RecentResultRow key={i} club={club} match={m} locale={locale} labels={resultLabels} />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal id="club-honours" delay={0.25} className="mt-10 scroll-mt-32 border-t border-fg-faint pt-8">
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
        <Reveal id="club-legends" stagger delay={0.25} className="mt-10 scroll-mt-32 border-t border-fg-faint pt-8">
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
    </div>
  );
}
