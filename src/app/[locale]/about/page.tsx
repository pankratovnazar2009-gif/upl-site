import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { leagueTimeline, leadership } from "@/data/league-history";
import { documentFolders } from "@/data/documents";
import { getAwardsNews } from "@/lib/upl-source";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { AboutTabs } from "@/components/about-tabs";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as "uk" | "en";
  const awards = await getAwardsNews(3);

  const historyTab = (
    <div>
      <Reveal stagger as="ul" className="flex flex-col">
        {leagueTimeline.map((entry) => (
          <RevealItem
            key={entry.date}
            className="grid grid-cols-[100px_1fr] gap-4 border-t border-fg-faint py-5 first:border-t-0 sm:grid-cols-[140px_1fr] sm:gap-8"
          >
            <span className="font-display text-[14px] font-bold tabular-nums text-accent">
              {entry.date}
            </span>
            <div>
              <p className="text-[15px] font-semibold">{entry.title[locale]}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">
                {entry.body[locale]}
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );

  const leadershipTab = (
    <Reveal stagger as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
      {leadership.map((person) => (
        <RevealItem key={person.name}>
          <div className="aspect-[4/5] w-full overflow-hidden bg-bg-raised">
            <Image
              src={person.photo}
              alt={person.name}
              width={220}
              height={275}
              className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
          </div>
          <p className="mt-3 text-[14px] font-semibold leading-tight">{person.name}</p>
          <p className="mt-1 text-[12px] leading-snug text-fg-muted">{person.role[locale]}</p>
        </RevealItem>
      ))}
    </Reveal>
  );

  const awardsTab =
    awards && awards.items.length > 0 ? (
      <div>
        <p className="text-[13.5px] text-fg-muted">{t("awardsSubtitle")}</p>
        <Reveal stagger as="ul" className="mt-6 flex flex-col">
          {awards.items.map((item) => (
            <RevealItem key={item.id} className="border-t border-fg-faint py-4 first:border-t-0">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-accent"
              >
                <p className="text-[12px] tabular-nums text-fg-muted">{item.date}</p>
                <p className="mt-1 text-[15px] font-semibold leading-snug">{item.title}</p>
              </a>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    ) : (
      <p className="text-[14px] text-fg-muted">{t("awardsSubtitle")}</p>
    );

  const documentsTab = (
    <div>
      <p className="text-[13.5px] text-fg-muted">{t("documentsSubtitle")}</p>
      <Reveal stagger className="mt-6 flex flex-col gap-3">
        {documentFolders.map((folder) => (
          <RevealItem key={folder.name.uk}>
            <details className="group border border-fg-faint">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-bg-raised px-4 py-3 text-[13px] font-bold uppercase tracking-[0.06em] transition-colors hover:text-accent">
                <span className="flex items-center gap-2.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-fg-muted"
                  >
                    <path
                      d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {folder.name[locale]}
                </span>
                <span className="shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <ul className="flex flex-col border-t border-fg-faint">
                {folder.items.map((doc) => (
                  <li key={doc.url} className="border-t border-fg-faint first:border-t-0">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 px-4 py-3 text-[13.5px] font-medium transition-colors hover:text-accent"
                    >
                      {doc.title[locale]}
                      <span className="text-label shrink-0 uppercase tracking-[0.06em] text-fg-muted">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </RevealItem>
        ))}
      </Reveal>
      <a
        href="https://upl.ua/ua/pages/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-[12px] font-medium uppercase tracking-[0.06em] text-accent underline decoration-1 underline-offset-4"
      >
        {t("documentsAllLink")} →
      </a>
    </div>
  );

  return (
    <div className="mx-auto max-w-[900px] px-(--gutter) py-(--section-y-dense)">
      <Reveal>
        <p className="text-label uppercase tracking-[0.14em] text-accent">2008–2026</p>
        <h1 className="font-display mt-2 text-[clamp(2rem,5vw,3rem)] font-bold">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="mt-12">
        <AboutTabs
          tabs={[
            { key: "history", label: t("tabHistory"), content: historyTab },
            { key: "leadership", label: t("tabLeadership"), content: leadershipTab },
            { key: "awards", label: t("tabAwards"), content: awardsTab },
            { key: "documents", label: t("tabDocuments"), content: documentsTab },
          ]}
        />
      </div>
    </div>
  );
}
