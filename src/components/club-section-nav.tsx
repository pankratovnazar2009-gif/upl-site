"use client";

import { useEffect, useState } from "react";

export type ClubSection = { id: string; label: string };

/**
 * Sticky in-page nav for the club profile: the page is long (squad, kits,
 * results, honours), so this lets you jump straight to a block instead of
 * scrolling through everything. Sits directly under the 64px site header.
 */
export function ClubSectionNav({ sections }: { sections: ClubSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    // Treat the band just below the sticky header as the "reading line" —
    // whichever section covers it is the one you're looking at.
    const onScroll = () => {
      const line = 150;
      let current = nodes[0].id;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <div className="sticky top-16 z-30 border-b border-fg-faint bg-bg-glass backdrop-blur-md">
      <nav className="mx-auto flex max-w-[900px] gap-1 overflow-x-auto px-(--gutter) [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`relative shrink-0 py-3.5 pr-5 text-[12.5px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                isActive ? "text-accent" : "text-fg-muted hover:text-fg"
              }`}
            >
              {section.label}
              <span
                className={`absolute bottom-0 left-0 right-5 h-[2px] bg-accent transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </div>
  );
}
