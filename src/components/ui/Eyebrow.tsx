import Badge from "./Badge";

export default function Eyebrow({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">{children}</span>
      {badge && <Badge>{badge}</Badge>}
    </div>
  );
}
