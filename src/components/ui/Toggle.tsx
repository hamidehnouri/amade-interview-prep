export default function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative mt-[2px] h-[22px] w-[38px] flex-shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-[var(--neutral-300)]"}`}>
        <span className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-[2px]"}`} />
      </button>
      <span>
        <span className="block font-display text-[14px] font-semibold text-ink">{label}</span>
        {hint && <span className="block text-[12px] text-muted">{hint}</span>}
      </span>
    </div>
  );
}
