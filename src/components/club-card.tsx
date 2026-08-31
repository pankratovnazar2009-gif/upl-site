import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Club } from "@/data/clubs";

export async function ClubCard({ club }: { club: Club }) {
  const locale = (await getLocale()) as "uk" | "en";
  const t = await getTranslations("clubs");

  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="group flex flex-col justify-between border border-fg-faint p-6 transition-colors duration-300 hover:border-accent"
    >
      <div className="flex items-start justify-between gap-4">
        <Image
          src={club.logo}
          alt=""
          width={48}
          height={48}
          className={`h-12 w-12 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
        />
        <span className="text-label uppercase tracking-[0.1em] text-fg-muted">
          {club.city[locale]}
        </span>
      </div>
      <div className="mt-8">
        <h3 className="font-display text-[19px] font-bold leading-tight transition-colors duration-300 group-hover:text-accent">
          {club.name[locale]}
        </h3>
        <p className="mt-1.5 text-[13px] text-fg-muted">
          {t("founded")} {club.founded}
        </p>
      </div>
    </Link>
  );
}
