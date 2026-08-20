import { getTranslations } from "next-intl/server";
import { clubs } from "@/data/clubs";
import { ClubCard } from "@/components/club-card";
import { Reveal, RevealItem } from "@/components/motion/reveal";

export default async function ClubsPage() {
  const t = await getTranslations("clubs");

  return (
    <div className="mx-auto max-w-[1200px] px-(--gutter) py-(--section-y-dense)">
      <Reveal>
        <p className="text-label uppercase tracking-[0.14em] text-accent">
          16 / 16
        </p>
        <h1 className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] font-bold">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal stagger as="ul" className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <RevealItem key={club.slug}>
            <ClubCard club={club} />
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );
}
