import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import type { Question } from "@/lib/api";

export default function PracticeStep({ question, answer, onChange }: {
  question: Question; answer: string; onChange: (v: string) => void;
}) {
  return (
    <>
      <Card>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">AI Interviewer</span>
          <span className="rounded-[8px] border border-blue-200 bg-blue-50 px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] text-blue-700">{question.category}</span>
        </div>
        <div className="mt-3 font-display text-[18px] font-semibold leading-snug text-ink">{question.question}</div>
      </Card>
      <Card>
        <Textarea label="Your answer" value={answer} onChange={onChange} rows={8} placeholder="Type your answer here…" />
      </Card>
    </>
  );
}
