import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { clubs, getClubBySlug } from "@/data/clubs";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { LegendCard } from "@/components/legend-card";

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

  const facts: Array<[string, string]> = [
    [t("founded"), club.founded],
    ...(club.refounded ? ([[t("refounded"), club.refounded]] as Array<[string, string]>) : []),
    [t("stadium"), club.stadium],
    [club.leaderRole[locale], club.leaderName],
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

      <Reveal delay={0.2} className="mt-10 border-t border-fg-faint pt-8">
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
