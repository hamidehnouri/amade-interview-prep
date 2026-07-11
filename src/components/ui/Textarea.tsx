export default function Textarea({ label, value, onChange, placeholder, rows = 6 }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="font-display text-[14px] font-semibold text-ink">{label}</span>}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full resize-y rounded-[10px] border border-line bg-white p-3 text-[14px] text-ink outline-none focus:border-accent" />
    </label>
  );
}
