import { Check, AlertTriangle, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import ScoreRing from "@/components/ui/ScoreRing";
import type { Feedback, Question } from "@/lib/api";

const STAR = ["situation", "task", "action", "result"] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

type Tone = "good" | "warn" | "info" | "overall";
function FeedbackRow({ tone, title, detail }: { tone: Tone; title: string; detail: string }) {
  const cfg = {
    good: { bg: "bg-blue-50", color: "text-accent", Icon: Check },
    warn: { bg: "bg-amber-50", color: "text-amber-600", Icon: AlertTriangle },
    info: { bg: "bg-blue-50", color: "text-accent", Icon: MessageCircle },
    overall: { bg: "bg-blue-50", color: "text-accent", Icon: MessageCircle },
  }[tone];
  const Icon = cfg.Icon;
  return (
    <div className={`flex items-start gap-3 rounded-[8px] ${cfg.bg} p-3`}>
      <Icon className={`mt-0.5 shrink-0 ${cfg.color}`} size={18} />
      <div>
        <div className="font-display text-[14px] font-semibold text-ink">{title}</div>
        <div className="text-[13px] text-secondary">{detail}</div>
      </div>
    </div>
  );
}

export default function ScoreStep({ feedback }: { question: Question; feedback: Feedback }) {
  const scores = STAR.map((p) => feedback[p].score);
  const score = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10);
  const headline =
    score >= 85 ? "Excellent — interview-ready" :
    score >= 70 ? "Strong, with room to tighten" :
    score >= 55 ? "Solid — keep practising" : "Needs work — try again";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
      <Card className="flex flex-col items-center text-center">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">Session score</div>
        <div className="my-3"><ScoreRing value={score} /></div>
        <div className="font-display text-[16px] font-bold text-ink">{headline}</div>
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
                  <div className="h-1.5 rounded bg-accent" style={{ width: `${pct}%` }} />
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
            const sc = feedback[p].score;
            const tone: Tone = sc >= 7 ? "good" : sc >= 4 ? "warn" : "info";
            return <FeedbackRow key={p} tone={tone} title={`${cap(p)} · ${sc}/10`} detail={feedback[p].feedback} />;
          })}
          <FeedbackRow tone="overall" title="Overall" detail={feedback.overall} />
        </div>
      </Card>
    </div>
  );
}
