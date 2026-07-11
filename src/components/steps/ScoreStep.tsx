import Card from "@/components/ui/Card";
import type { Feedback, Question } from "@/lib/api";

const STAR = ["situation", "task", "action", "result"] as const;

export default function ScoreStep({ question, feedback }: { question: Question; feedback: Feedback }) {
  return (
    <Card>
      <div className="font-display text-[15px] font-semibold text-ink">STAR feedback — {question.category}</div>
      <div className="mt-3 flex flex-col gap-2">
        {STAR.map((part) => (
          <div key={part} className="text-[14px]">
            <span className="font-semibold capitalize text-ink">{part}: {feedback[part].score}/10</span>
            <span className="text-secondary"> — {feedback[part].feedback}</span>
          </div>
        ))}
        <div className="mt-1 rounded-[8px] bg-blue-50 p-3 text-[14px] text-blue-700">{feedback.overall}</div>
      </div>
    </Card>
  );
}
