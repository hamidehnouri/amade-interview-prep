import { Check, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import ScoreRing from "@/components/ui/ScoreRing";
import type { Feedback, Question } from "@/lib/api";

const STAR = ["situation", "task", "action", "result"] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Level by STAR score (0–10): red → yellow → blue → green
const LEVEL = {
  green: { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500", ring: "#16a34a", Icon: Check },
  blue: { bg: "bg-blue-50", text: "text-accent", bar: "bg-accent", ring: "#4C6EF5", Icon: Check },
  yellow: { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-400", ring: "#f59e0b", Icon: AlertTriangle },
  red: { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500", ring: "#dc2626", Icon: AlertTriangle },
} as const;
type Level = keyof typeof LEVEL;
const levelOf = (s10: number): Level => (s10 >= 8 ? "green" : s10 >= 6 ? "blue" : s10 >= 4 ? "yellow" : "red");

export default function ScoreStep({ feedback }: { question: Question; feedback: Feedback }) {
  const scores = STAR.map((p) => feedback[p].score);
  const score = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10);
  const overallLevel = levelOf(score / 10);
  const headline =
    score >= 85 ? "Excellent — interview-ready" :
    score >= 70 ? "Strong, with room to tighten" :
    score >= 55 ? "Solid — keep practising" : "Needs work — try again";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[8px] border border-blue-200 bg-blue-50 p-4">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Overall</div>
        <div className="mt-1 font-display text-[15px] font-semibold text-ink">{headline}</div>
        <div className="mt-0.5 text-[14px] text-secondary">{feedback.overall}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Session score</div>
          <div className="my-3"><ScoreRing value={score} color={LEVEL[overallLevel].ring} /></div>
          <div className="text-[12px] text-muted">Scored across the STAR framework</div>
          <div className="mt-5 flex w-full flex-col gap-3">
            {STAR.map((p) => {
              const pct = feedback[p].score * 10;
              const lv = LEVEL[levelOf(feedback[p].score)];
              return (
                <div key={p}>
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium text-ink">{cap(p)}</span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-line-subtle">
                    <div className={`h-1.5 rounded ${lv.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Eyebrow>STAR coach feedback</Eyebrow>
          <div className="flex flex-col gap-3">
            {STAR.map((p) => {
              const lv = LEVEL[levelOf(feedback[p].score)];
              const Icon = lv.Icon;
              return (
                <div key={p} className={`flex items-start gap-3 rounded-[8px] ${lv.bg} p-3`}>
                  <Icon className={`mt-0.5 shrink-0 ${lv.text}`} size={18} />
                  <div>
                    <div className="font-display text-[14px] font-semibold text-ink">{cap(p)} · {feedback[p].score}/10</div>
                    <div className="text-[13px] text-secondary">{feedback[p].feedback}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
