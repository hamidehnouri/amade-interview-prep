export default function StepHeader({ n, title, subtitle }: { n: number; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 font-display text-[13px] font-semibold text-accent">{n}</div>
      <div>
        <h1 className="font-display text-[20px] font-bold tracking-tight text-ink">{title}</h1>
        <p className="text-[13px] text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}
