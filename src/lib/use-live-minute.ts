"use client";

import { useEffect, useState } from "react";
import { getLiveMinute, type ScheduleMatch } from "@/lib/upl-source";

/**
 * Client-only live-minute polling for a fixture — starts at `null` (so SSR
 * and the first client render always agree, avoiding a hydration mismatch)
 * and only starts showing a value once mounted, refreshed every minute.
 */
export function useLiveMinute(match: ScheduleMatch): number | null {
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMinute(getLiveMinute(match));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [match]);

  return minute;
}
