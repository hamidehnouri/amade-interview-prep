export default function Slider({ label, value, min, max, step = 1, onChange, format, hint, ticks, disabled }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange?: (v: number) => void; format?: (v: number) => string; hint?: string; ticks?: string[]; disabled?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-45" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[14px] font-semibold text-ink">{label}</span>
        <span className="font-mono text-[13px] font-semibold text-accent">{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        className="amade-range h-[6px] w-full cursor-pointer appearance-none rounded-full disabled:cursor-default"
        style={{ background: `linear-gradient(to right, var(--blue-500) ${pct}%, var(--neutral-100) ${pct}%)` }} />
      {ticks && <div className="flex justify-between font-mono text-[11px] text-muted">{ticks.map((t) => <span key={t}>{t}</span>)}</div>}
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </div>
  );
}
