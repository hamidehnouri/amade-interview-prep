import { Lock } from "lucide-react";
import Badge from "./Badge";

export default function Kicker({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="inline-flex items-center gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">{label}</span>
        <Badge tone="accent"><Lock size={10} /> Dev only</Badge>
      </div>
      {badge && <Badge>{badge}</Badge>}
    </div>
  );
}
