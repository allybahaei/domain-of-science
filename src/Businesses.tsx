/** Replace gray bars with `<img src="/businesses/…" alt="…" />` when logos are ready. */
const LOGO_PLACEHOLDER_WIDTHS = [96, 72, 104, 88, 76, 92];

export default function Businesses() {
  return (
    <section className="self-stretch w-full mt-[72px] px-6 pt-7 pb-8 bg-white border-t border-zinc-100" aria-label="Trusted by">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-7 max-w-[1100px] mx-auto">
        <LogoPlaceholder label="Company 1" width={LOGO_PLACEHOLDER_WIDTHS[0]} />
        <LogoPlaceholder label="Company 2" width={LOGO_PLACEHOLDER_WIDTHS[1]} />
        <LogoPlaceholder label="Company 3" width={LOGO_PLACEHOLDER_WIDTHS[2]} />
        <RatingPlaceholder />
        <LogoPlaceholder label="Company 4" width={LOGO_PLACEHOLDER_WIDTHS[3]} />
        <LogoPlaceholder label="Company 5" width={LOGO_PLACEHOLDER_WIDTHS[4]} />
        <LogoPlaceholder label="Company 6" width={LOGO_PLACEHOLDER_WIDTHS[5]} />
      </div>
    </section>
  );
}

function LogoPlaceholder({ label, width }: { label: string; width: number }) {
  return (
    <div className="flex items-center opacity-65" aria-hidden title={label}>
      <div className="h-6 rounded bg-slate-400" style={{ width }} />
    </div>
  );
}

function RatingPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-1 px-3.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50 min-w-[120px]" aria-hidden>
      <span className="text-[11px] font-semibold text-slate-500 tracking-wide">4.9 out of 5</span>
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
        ))}
      </div>
      <span className="text-[10px] text-slate-400">Placeholder reviews</span>
    </div>
  );
}
