import { Check } from "lucide-react";

export type StepItem = { key: string; label: string };

export default function Stepper({ steps, current, onStepClick, className = "" }: {
  steps: StepItem[]; current: number; onStepClick?: (index: number) => void; className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((s, i) => {
        const reached = i <= current;
        const done = i < current;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-2 last:flex-none">
            <button type="button" disabled={!reached} onClick={() => reached && onStepClick?.(i)} className="flex items-center gap-2 disabled:cursor-default">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${reached ? "bg-accent text-white" : "bg-line-subtle text-muted"}`}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={`text-[13px] font-medium ${i === current ? "text-ink" : reached ? "text-secondary hover:text-ink" : "text-muted"}`}>{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-line" />}
          </div>
        );
      })}
    </div>
  );
}
