import { Bot } from "lucide-react";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import type { Question } from "@/lib/api";

export default function PracticeStep({ question, index, total, answer, onChange }: {
  question: Question; index: number; total: number; answer: string; onChange: (v: string) => void;
}) {
  const pct = ((index + 1) / total) * 100;
  return (
    <>
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          Practice · Question {index + 1} of {total}
        </div>
        <div className="mt-2 h-1 rounded bg-line-subtle">
          <div className="h-1 rounded bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <Card className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"><Bot size={18} /></div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[13px] font-semibold text-ink">AI Interviewer</span>
            <span className="rounded-[8px] border border-blue-200 bg-blue-50 px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] text-blue-700">{question.category}</span>
          </div>
        </div>
        <div className="mt-3 font-display text-[20px] font-medium leading-snug text-ink">{question.question}</div>
        <div className="mt-4 flex flex-1 flex-col"><Textarea value={answer} onChange={onChange} grow placeholder="Type your answer here…" /></div>
      </Card>
    </>
  );
}
