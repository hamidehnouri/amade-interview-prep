"use client";
import Tag from "./Tag";
import { levelOf, LEVEL } from "@/lib/score";

const DIFF_TONE = { Easy: "green", Medium: "amber", Hard: "red" } as const;

export default function QuestionCard({ category, difficulty, question, meta, score = null, onPractice }: {
  category?: string; difficulty?: "Easy" | "Medium" | "Hard"; question: string; meta?: string; score?: number | null; onPractice?: () => void;
}) {
  const practiced = score != null;
  return (
    <div className="rounded-[8px] border border-line bg-white p-5 transition-shadow hover:shadow-[0_1px_2px_rgba(35,41,70,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        {category && <Tag tone="blue">{category}</Tag>}
        {difficulty && <Tag tone={DIFF_TONE[difficulty]}>{difficulty}</Tag>}
        {practiced && (
          <span className="ml-auto flex items-center gap-2">
            <Tag tone="neutral">Practiced</Tag>
            <span className={`font-mono text-[13px] font-bold ${LEVEL[levelOf(score)].text}`}>
              {score}<span className="font-normal text-muted"> /100</span>
            </span>
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-[18px] font-medium leading-snug text-ink">{question}</div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {meta && <span className="text-[12px] text-muted">{meta}</span>}
        {onPractice && (
          <button type="button" onClick={onPractice} className="ml-auto inline-flex items-center gap-1.5 rounded-[8px] bg-accent px-3.5 py-2 font-display text-[13px] font-semibold text-white transition-colors hover:bg-blue-700">
            {practiced ? "Retry" : "Practice"}
          </button>
        )}
      </div>
    </div>
  );
}
