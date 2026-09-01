export function LiveBadge({ minute, label }: { minute: number; label: string }) {
  return (
    <span className="font-display inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold tabular-nums text-live">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      {label} {minute}&apos;
    </span>
  );
}
