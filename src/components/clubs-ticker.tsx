"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Club } from "@/data/clubs";

const AUTO_SCROLL_PX_PER_TICK = 0.6;
const DRAG_CLICK_THRESHOLD_PX = 6;

function ClubChip({
  club,
  locale,
  hasDraggedRef,
}: {
  club: Club;
  locale: "uk" | "en";
  hasDraggedRef: RefObject<boolean>;
}) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (hasDraggedRef.current) return;
        router.push(`/clubs/${club.slug}`);
      }}
      className="flex shrink-0 cursor-pointer items-center gap-2.5 border-r border-fg-faint px-5 py-3.5 transition-colors duration-200 hover:bg-bg"
    >
      <Image
        src={club.logo}
        alt=""
        width={24}
        height={24}
        draggable={false}
        className={`pointer-events-none h-6 w-6 shrink-0 object-contain ${club.monochromeDark ? "brightness-0 invert" : ""}`}
      />
      <span className="pointer-events-none whitespace-nowrap text-[12.5px] font-bold uppercase tracking-[0.02em]">
        {club.name[locale]}
      </span>
    </div>
  );
}

/**
 * A scrolling club directory across the top of the homepage — replaces the
 * old fixtures ticker at the client's request. Same drift/drag-to-scroll
 * mechanics as that ticker (a click is told apart from a drag by pointer
 * travel distance), just with each chip a club instead of a fixture.
 */
export function ClubsTicker({ clubs }: { clubs: Club[] }) {
  const locale = useLocale() as "uk" | "en";
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number;
    function tick() {
      if (el && !pausedRef.current && !draggingRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          el.scrollLeft =
            el.scrollLeft >= maxScroll - 1 ? 0 : el.scrollLeft + AUTO_SCROLL_PX_PER_TICK;
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    hasDraggedRef.current = false;
    el.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, scrollLeft: el.scrollLeft };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !trackRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD_PX) hasDraggedRef.current = true;
    trackRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
  }
  function onPointerUp() {
    draggingRef.current = false;
  }

  return (
    <div className="border-b border-fg-faint bg-bg-raised">
      <div
        ref={trackRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="mx-auto flex max-w-[1440px] cursor-grab items-stretch overflow-x-auto active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {clubs.map((club) => (
          <ClubChip key={club.slug} club={club} locale={locale} hasDraggedRef={hasDraggedRef} />
        ))}
      </div>
    </div>
  );
}
