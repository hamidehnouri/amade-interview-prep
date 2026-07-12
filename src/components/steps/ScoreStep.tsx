import { Check, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import Eyebrow from "@/components/ui/Eyebrow";
import ScoreRing from "@/components/ui/ScoreRing";
import { STAR, overallScore, levelOf, LEVEL } from "@/lib/score";
import type { Feedback, Question } from "@/lib/api";

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ScoreStep({ feedback }: { question: Question; feedback: Feedback }) {
  const score = overallScore(feedback);
  const headline =
    score >= 85 ? "Excellent — interview-ready" :
    score >= 70 ? "Strong, with room to tighten" :
    score >= 55 ? "Solid — keep practising" : "Needs work — try again";

  return (
    <div className="flex flex-col gap-6">
      <Callout>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Overall</div>
        <div className="mt-1 font-display text-[15px] font-semibold text-ink">{headline}</div>
        <div className="mt-0.5 text-[14px] text-secondary">{feedback.overall}</div>
      </Callout>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Session score</div>
          <div className="my-3"><ScoreRing value={score} color={LEVEL[levelOf(score)].ring} /></div>
          <div className="text-[12px] text-muted">Scored across the STAR framework</div>
          <div className="mt-5 flex w-full flex-col gap-3">
            {STAR.map((p) => {
              const pct = feedback[p].score * 10;
              return (
                <div key={p}>
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium text-ink">{cap(p)}</span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-line-subtle">
                    <div className={`h-1.5 rounded ${LEVEL[levelOf(pct)].bar}`} style={{ width: `${pct}%` }} />
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
              const lv = LEVEL[levelOf(feedback[p].score * 10)];
              const Icon = feedback[p].score >= 6 ? Check : AlertTriangle;
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
