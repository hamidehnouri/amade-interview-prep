type Option = { value: string; label: string };

export default function Select({ label, value, options, onChange }: {
  label: string; value: string; options: Option[]; onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[14px] font-semibold text-ink">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-[38px] rounded-[8px] border border-line bg-white px-3 text-[14px] text-ink outline-none focus:border-accent">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
