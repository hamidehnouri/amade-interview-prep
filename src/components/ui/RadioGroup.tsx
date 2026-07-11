import Badge from "./Badge";

type Opt = { value: string; label: string; description?: string; badge?: string };

export default function RadioGroup({ value, options, onChange, columns = 1 }: {
  value: string; options: Opt[]; onChange: (v: string) => void; columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`flex items-start gap-3 rounded-[8px] border p-3 text-left transition-colors ${active ? "border-accent bg-blue-50" : "border-line hover:bg-line-subtle"}`}>
            <span className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-accent" : "border-muted"}`}>
              {active && <span className="h-2 w-2 rounded-full bg-accent" />}
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-[14px] font-semibold text-ink">{o.label}</span>
                {o.badge && <Badge>{o.badge}</Badge>}
              </span>
              {o.description && <span className="mt-0.5 block text-[12px] text-secondary">{o.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
