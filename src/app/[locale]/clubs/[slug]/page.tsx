import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { clubs, getClubBySlug } from "@/data/clubs";
import { Reveal } from "@/components/motion/reveal";

export function generateStaticParams() {
  return clubs.map((c) => ({ slug: c.slug }));
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
    [t("stadium"), club.stadium],
    [club.leaderRole[locale], club.leaderName],
  ];

  return (
    <div className="mx-auto max-w-[900px] px-(--gutter) py-(--section-y-dense)">
      <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Image
          src={club.logo}
          alt=""
          width={88}
          height={88}
          className="h-20 w-20 object-contain sm:h-[88px] sm:w-[88px]"
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
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-fg-faint pt-8 sm:grid-cols-3"
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
    </div>
  );
}
