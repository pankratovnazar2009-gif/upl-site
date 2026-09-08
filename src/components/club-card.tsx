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
      <div className="flex items-start justify-between gap-3">
        <Image
          src={club.logo}
          alt=""
          width={48}
          height={48}
          className={`h-12 w-12 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
        />
        {/* Long, hyphenated city names ("Кам'янець-Подільський") would break
            onto a second line at the hyphen and knock the card's top row out
            of line with every other card. Kept on one line where there is
            room; right-aligned so a wrap on a narrow phone still sits flush
            with the card edge like every other city. */}
        <span className="text-right text-label uppercase tracking-[0.06em] text-fg-muted sm:whitespace-nowrap">
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
