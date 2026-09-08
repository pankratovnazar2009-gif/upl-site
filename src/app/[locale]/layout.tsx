import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

// One variable font for the whole site (headings and body alike) —
// Geologica ships weights 100-900 in a single file and covers Cyrillic,
// so both semantic roles (--font-display / --font-body, see globals.css)
// point at this same instance.
const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: "variable",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { default: t("homeTitle"), template: `%s — ${t("siteName")}` },
    description: t("homeDescription"),
    icons: { icon: "/logos/upl-favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${geologica.variable} h-full antialiased`}
    >
      <head>
        {/*
          Two jobs, both before first paint and both independent of the app
          bundle — this is deliberately plain inline script, not a component:

          1. `js` marks the document as JS-capable. Scroll reveals hide their
             content in CSS and that hidden state is scoped to this flag, so a
             slow, blocked or broken bundle leaves the page fully visible
             instead of stuck at opacity 0.
          2. `splash-done` dismisses the intro overlay as soon as the page has
             actually loaded (never before ~550ms, so it doesn't flash, and
             never after 1.5s, so a slow image can't hold the site hostage).
             The overlay is then taken out of the layout outright, so a
             browser that never runs the fade cannot leave it covering the
             page; with this script gone, its own CSS timeline still hides it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add('js');var s=Date.now(),hidden=false;function hide(){if(hidden)return;hidden=true;d.classList.add('splash-done');setTimeout(function(){var el=document.getElementById('splash');if(el)el.style.display='none'},450)}function done(){setTimeout(hide,Math.max(0,550-(Date.now()-s)))}if(document.readyState==='complete'){done()}else{addEventListener('load',done,{once:true})}setTimeout(hide,1500)})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {/*
          Branded intro. Static markup with a CSS-only timeline: no counter, no
          JS-driven progress, nothing that can freeze mid-way — the previous
          version animated a percentage on requestAnimationFrame and stuck at
          0% whenever the browser throttled frames.
        */}
        <div id="splash" aria-hidden="true">
          <span className="splash-mark" />
          <span className="splash-bar" />
        </div>

        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
