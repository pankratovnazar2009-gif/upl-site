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
          Marks the document as JS-capable before first paint. Scroll reveals
          hide their content in CSS and that hidden state is scoped to this
          flag, so a slow, blocked or broken bundle leaves the page fully
          visible instead of stuck at opacity 0.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
