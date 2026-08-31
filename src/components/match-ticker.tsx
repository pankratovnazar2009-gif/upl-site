"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getClubBySlug } from "@/data/clubs";
import type { ScheduleRound } from "@/lib/upl-source";

const WEEKDAY_UK = ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const WEEKDAY_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_UK = ["СІЧ", "ЛЮТ", "БЕР", "КВІ", "ТРА", "ЧЕР", "ЛИП", "СЕР", "ВЕР", "ЖОВ", "ЛИС", "ГРУ"];
const MONTH_EN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const AUTO_SCROLL_PX_PER_TICK = 0.6;

function shortDate(date: string, locale: "uk" | "en") {
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return { weekday: "", day: date, month: "" };
  const [, d, mo, y] = m;
  const jsDate = new Date(Number(y), Number(mo) - 1, Number(d));
  const weekdays = locale === "uk" ? WEEKDAY_UK : WEEKDAY_EN;
  const months = locale === "uk" ? MONTH_UK : MONTH_EN;
  return { weekday: weekdays[jsDate.getDay()], day: d, month: months[Number(mo) - 1] };
}

/**
 * A live fixtures strip for the current round — the "this is unmistakably a
 * football site" signal, same job the ticker at the top of legaseriea.it
 * does. Drifts sideways on its own; dragging with the pointer takes over and
 * pauses the drift until the pointer leaves.
 */
export function MatchTicker({ round }: { round: ScheduleRound }) {
  const t = useTranslations("standings");
  const locale = useLocale() as "uk" | "en";
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
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
    el.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, scrollLeft: el.scrollLeft };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !trackRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
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
        <div className="flex shrink-0 items-center border-r border-fg-faint px-5 py-3.5">
          <span className="font-display whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.06em] text-accent">
            {t("round")} {round.round}
          </span>
        </div>

        {round.matches.map((m, i) => {
          const home = m.homeSlug ? getClubBySlug(m.homeSlug) : undefined;
          const away = m.awaySlug ? getClubBySlug(m.awaySlug) : undefined;
          const { weekday, day, month } = shortDate(m.date, locale);

          return (
            <div
              key={i}
              className="flex shrink-0 items-center gap-3 border-r border-fg-faint px-5 py-3"
            >
              <div className="pointer-events-none flex flex-col items-center leading-none text-fg-muted">
                <span className="text-[9px] font-medium uppercase tracking-[0.04em]">{weekday}</span>
                <span className="font-display mt-0.5 text-[13px] font-bold text-fg">{day}</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.04em]">{month}</span>
              </div>

              <div className="pointer-events-none flex items-center gap-2">
                {home && (
                  <Image
                    src={home.logo}
                    alt=""
                    width={20}
                    height={20}
                    draggable={false}
                    className={`h-5 w-5 shrink-0 object-contain ${home.monochromeDark ? "dark:brightness-0 dark:invert" : ""}`}
                  />
                )}
                <span className="text-[12px] font-bold uppercase tracking-[0.02em]">
                  {home ? home.code[locale] : m.homeName.slice(0, 3).toUpperCase()}
                </span>
              </div>

              <span className="font-display pointer-events-none min-w-[38px] text-center text-[13px] font-bold tabular-nums">
                {m.status === "finished" ? `${m.score?.home}–${m.score?.away}` : (m.time ?? "—")}
              </span>

              <div className="pointer-events-none flex items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-[0.02em]">
                  {away ? away.code[locale] : m.awayName.slice(0, 3).toUpperCase()}
                </span>
                {away && (
                  <Image
                    src={away.logo}
                    alt=""
                    width={20}
                    height={20}
                    draggable={false}
                    className={`h-5 w-5 shrink-0 object-contain ${away.monochromeDark ? "dark:brightness-0 dark:invert" : ""}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
