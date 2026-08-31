import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="border-t border-fg-faint bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-(--gutter) py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <Image
              src="/logos/upl-mark.png"
              alt="УПЛ"
              width={40}
              height={40}
              className="h-9 w-9 object-contain opacity-90 brightness-0 invert"
            />
            <div className="max-w-xs text-[13px] leading-relaxed text-fg-muted">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.04em] text-fg">
                {t("org")}
              </p>
              <p className="mt-1">{t("address")}</p>
            </div>
          </div>

          <nav className="flex gap-8 text-[13px] uppercase tracking-[0.06em] text-fg-muted">
            <Link href="/" className="transition-colors hover:text-fg">
              {nav("home")}
            </Link>
            <Link href="/tournament" className="transition-colors hover:text-fg">
              {nav("tournament")}
            </Link>
            <Link href="/clubs" className="transition-colors hover:text-fg">
              {nav("clubs")}
            </Link>
            <Link href="/news" className="transition-colors hover:text-fg">
              {nav("news")}
            </Link>
            <Link href="/about" className="transition-colors hover:text-fg">
              {nav("about")}
            </Link>
          </nav>

          <nav className="flex gap-8 text-[13px] uppercase tracking-[0.06em] text-fg-muted">
            <a
              href="https://tv.upl.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              UPL.TV
            </a>
            <a
              href="https://upl.ua/ua/photo-galleries"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              {t("gallery")}
            </a>
            <a
              href="https://upl.ua/ua/pages/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              {t("documents")}
            </a>
          </nav>
        </div>

        <div className="mt-10 border-t border-fg-faint pt-6 text-[12px] leading-relaxed text-fg-muted">
          <p>{t("contactsOrg")}</p>
          <p className="mt-2">
            <span className="text-fg">{t("addressLabel")}:</span> {t("contactsLine")}
          </p>
          <p>
            <span className="text-fg">{t("emailLabel")}:</span>{" "}
            <a href="mailto:info@upl.ua" className="transition-colors hover:text-fg">
              info@upl.ua
            </a>
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-fg-faint pt-4 text-[12px] text-fg-muted md:flex-row md:items-center md:justify-between">
          <p>
            © 2008–2026 {t("org")}. {t("rights")}.
          </p>
          <p>{t("sourceNote")}</p>
        </div>
      </div>
    </footer>
  );
}
