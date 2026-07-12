import { Bot } from "lucide-react";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Textarea from "@/components/ui/Textarea";
import Recorder from "@/components/ui/Recorder";
import type { Question } from "@/lib/api";

export default function PracticeStep({ question, practicedCount, total, answer, onChange }: {
  question: Question; practicedCount: number; total: number; answer: string; onChange: (v: string) => void;
}) {
  const pct = total ? (practicedCount / total) * 100 : 0;
  return (
    <>
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          Practice · {practicedCount} of {total} practised
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
            <Tag tone="blue">{question.category}</Tag>
          </div>
        </div>
        <div className="mt-3 font-display text-[20px] font-medium leading-snug text-ink">{question.question}</div>
        <div className="mt-3 rounded-[8px] bg-blue-50 px-3 py-2 text-[12px] text-blue-700">
          Structure your answer with <span className="font-semibold">STAR</span> — Situation, Task, Action, Result.
        </div>
        <div className="mt-4 flex flex-1 flex-col">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-display text-[14px] font-semibold text-ink">Your answer</span>
            <Recorder onTranscript={(t) => onChange(answer ? `${answer} ${t}` : t)} />
          </div>
          <Textarea value={answer} onChange={onChange} grow placeholder="Type or record your answer here…" />
        </div>
      </Card>
    </>
  );
}
