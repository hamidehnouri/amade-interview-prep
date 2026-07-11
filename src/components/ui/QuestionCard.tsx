"use client";
const DIFF: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};
export default function QuestionCard({ category, difficulty, question, meta, practiced, onPractice }: {
  category?: string; difficulty?: "Easy" | "Medium" | "Hard"; question: string; meta?: string; practiced?: boolean; onPractice?: () => void;
}) {
  return (
    <div className="rounded-[8px] border border-line bg-white p-5 transition-shadow hover:shadow-[0_1px_2px_rgba(35,41,70,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        {category && <span className="rounded-[8px] border border-blue-200 bg-blue-50 px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] text-blue-700">{category}</span>}
        {difficulty && <span className={`rounded-[8px] px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] ${DIFF[difficulty]}`}>{difficulty}</span>}
        {typeof practiced === "boolean" && (
          <span className={`ml-auto rounded-full px-2 py-[2px] font-mono text-[9.5px] uppercase tracking-[0.08em] ${practiced ? "bg-green-100 text-green-700" : "bg-line-subtle text-secondary"}`}>
            {practiced ? "Practiced" : "Not practiced"}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-[18px] font-medium leading-snug text-ink">{question}</div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {meta && <span className="text-[12px] text-muted">{meta}</span>}
        {onPractice && (
          <button type="button" onClick={onPractice} className="ml-auto inline-flex items-center gap-1.5 rounded-[8px] bg-accent px-3.5 py-2 font-display text-[13px] font-semibold text-white transition-colors hover:bg-blue-700">
            Practice
          </button>
        )}
      </div>
    </div>
  );
}
