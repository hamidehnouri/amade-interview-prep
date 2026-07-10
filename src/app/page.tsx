"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { analyze, coachAnswer, type Analysis, type Feedback } from "@/lib/api";

const STAR = ["situation", "task", "action", "result"] as const;

export default function PracticePage() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function runAnalyze() {
    setError("");
    setLoading(true);
    try {
      const res = await analyze(jd);
      setAnalysis(res.analysis);
      setQuestions(res.questions);
      setAnswers({});
      setFeedback({});
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function runFeedback(i: number, q: string) {
    setError("");
    setBusy(i);
    try {
      const fb = await coachAnswer(q, answers[i] ?? "");
      setFeedback((f) => ({ ...f, [i]: fb }));
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <p className="max-w-[560px] text-[14px] text-secondary">Paste a job description to get tailored interview questions.</p>

      <Card>
        <Textarea label="Job description" value={jd} onChange={setJd} rows={8} placeholder="Paste the role's job description…" />
        <div className="mt-4">
          <Button onClick={runAnalyze} loading={loading} disabled={!jd.trim()}>Analyze &amp; generate questions</Button>
        </div>
      </Card>

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      {analysis && (
        <>
          <Card>
            <div className="font-display text-[15px] font-semibold text-ink">Key skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {analysis.key_skills.map((s) => (
                <span key={s} className="rounded-full bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700">{s}</span>
              ))}
            </div>
          </Card>

          {questions.map((q, idx) => {
            const i = idx + 1;
            return (
              <Card key={i}>
                <div className="font-display text-[15px] font-semibold text-ink">{i}. {q}</div>
                <div className="mt-3">
                  <Textarea label="Your answer" value={answers[i] ?? ""} onChange={(v) => setAnswers((a) => ({ ...a, [i]: v }))} rows={4} />
                </div>
                <div className="mt-3">
                  <Button onClick={() => runFeedback(i, q)} loading={busy === i} disabled={!(answers[i] ?? "").trim()}>Get feedback</Button>
                </div>
                {feedback[i] && (
                  <div className="mt-4 flex flex-col gap-2">
                    {STAR.map((part) => (
                      <div key={part} className="text-[14px]">
                        <span className="font-semibold capitalize text-ink">{part}: {feedback[i][part].score}/10</span>
                        <span className="text-secondary"> — {feedback[i][part].feedback}</span>
                      </div>
                    ))}
                    <div className="mt-1 rounded-[8px] bg-blue-50 p-3 text-[14px] text-blue-700">{feedback[i].overall}</div>
                  </div>
                )}
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}
