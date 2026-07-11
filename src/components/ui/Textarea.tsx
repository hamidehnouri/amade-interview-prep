export default function Textarea({ label, value, onChange, placeholder, rows = 6, grow = false, readOnly = false }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; grow?: boolean; readOnly?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${grow ? "flex-1" : ""}`}>
      {label && <span className="font-display text-[14px] font-semibold text-ink">{label}</span>}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={grow ? undefined : rows} readOnly={readOnly}
        className={`w-full resize-y rounded-[10px] border border-line p-3 text-[14px] outline-none focus:border-accent ${grow ? "flex-1" : ""} ${readOnly ? "bg-line-subtle text-muted" : "bg-white text-ink"}`} />
    </label>
  );
}
