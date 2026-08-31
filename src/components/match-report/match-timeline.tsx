import type { MatchEvent } from "@/lib/upl-source";

function EventIcon({ event }: { event: MatchEvent }) {
  if (event.kind === "goal") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="12" cy="12" r="10" fill="var(--accent)" />
        <path d="M12 6.5l3.4 2.4-1.3 4.1H9.9l-1.3-4.1L12 6.5Z" fill="var(--bg)" />
      </svg>
    );
  }
  if (event.kind === "card") {
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-3.5 w-2.5 shrink-0 rounded-[1.5px] ${
          event.cardType === "red" ? "bg-live" : "bg-accent"
        }`}
      />
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-fg-muted">
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 4v13.5M8 17.5l-3.5-3.5M8 17.5l3.5-3.5M16 20V6.5M16 6.5 12.5 10M16 6.5 19.5 10"
      />
    </svg>
  );
}

function Side({ event, align }: { event: MatchEvent; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <EventIcon event={event} />
      <span className={`text-[13px] leading-snug ${align === "right" ? "text-right" : "text-left"}`}>
        {event.kind === "sub" ? (
          <>
            <span className="text-fg-muted line-through decoration-fg-muted/50">{event.players[0]}</span>
            <br />
            <span className="font-medium">{event.players[1]}</span>
          </>
        ) : (
          <span className="font-medium">{event.players[0]}</span>
        )}
      </span>
    </div>
  );
}

export function MatchTimeline({ events }: { events: MatchEvent[] }) {
  if (events.length === 0) return null;

  return (
    <ol className="flex flex-col">
      {events.map((event, i) => (
        <li
          key={i}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-fg-faint py-3 first:border-t-0 sm:gap-6"
        >
          <div className="flex justify-end">{event.side === "home" && <Side event={event} align="right" />}</div>
          <span className="font-display shrink-0 rounded-full bg-bg-raised px-2.5 py-1 text-[11px] font-bold tabular-nums text-fg-muted">
            {event.minute}
          </span>
          <div className="flex justify-start">{event.side === "away" && <Side event={event} align="left" />}</div>
        </li>
      ))}
    </ol>
  );
}
