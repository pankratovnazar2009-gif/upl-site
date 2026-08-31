"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitch } from "@/components/language-switch";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/tournament", label: t("tournament") },
    { href: "/clubs", label: t("clubs") },
    { href: "/news", label: t("news") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-fg-faint bg-bg-glass backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-(--gutter)">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/upl-mark.png"
            alt=""
            width={30}
            height={30}
            className="h-7 w-7 shrink-0 object-contain brightness-0 invert"
            priority
          />
          <span className="hidden font-display text-[13px] font-bold leading-[1.15] lg:block">
            Українська
            <br />
            Прем&apos;єр-Ліга
          </span>
          <span className="hidden font-display text-[15px] leading-none font-bold uppercase tracking-[0.02em] sm:inline lg:hidden">
            УПЛ
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
                  active ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
          <a
            href="https://tv.upl.ua/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium uppercase tracking-[0.08em] text-fg-muted transition-colors duration-300 hover:text-fg"
          >
            UPL.TV
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>
          <a
            href="https://tv.upl.ua/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 bg-live px-4 py-2 text-[12px] font-bold uppercase tracking-[0.04em] text-white transition-opacity duration-300 hover:opacity-85 sm:flex"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
            {t("watchLive")}
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-fg-faint md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path stroke="currentColor" strokeWidth="1.6" d="M4 4l16 16M20 4 4 20" />
              ) : (
                <path stroke="currentColor" strokeWidth="1.6" d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-fg-faint bg-bg px-(--gutter) py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[15px] font-medium uppercase tracking-[0.04em] text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://tv.upl.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2.5 text-[15px] font-medium uppercase tracking-[0.04em] text-fg"
              >
                UPL.TV
              </a>
            </li>
          </ul>
          <a
            href="https://tv.upl.ua/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 bg-live px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.04em] text-white"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
            {t("watchLive")}
          </a>
          <div className="mt-4 sm:hidden">
            <LanguageSwitch />
          </div>
        </nav>
      )}
    </header>
  );
}
