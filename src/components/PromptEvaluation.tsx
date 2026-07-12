"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import RadioGroup from "@/components/ui/RadioGroup";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { COACH_PROMPTS } from "@/lib/prompts";
import { TECHNIQUES, TECH_LABEL } from "@/lib/techniques";
import { overallScore } from "@/lib/score";
import { evaluate, type EvalResult } from "@/lib/api";
import { useSettings } from "@/lib/settings";

const STAR = ["situation", "task", "action", "result"] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const EXAMPLE = {
  question: "Tell me about a time you disagreed with your manager.",
  answer: "On the Q3 pricing launch my manager wanted a flat 20% discount. I pulled cohort data showing power users were price-insensitive, proposed a tiered structure, built a one-page model, and we A/B tested both. The tiered version lifted revenue 14% with no churn increase, and we rolled it out company-wide.",
};

export default function PromptEvaluation() {
  const { settings } = useSettings();
  const [technique, setTechnique] = useState("zero_shot");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<EvalResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(techniques: string[]) {
    if (!question.trim() || !answer.trim()) { setError("Add a sample question and answer first."); return; }
    setError(""); setLoading(true); setResults(null);
    try {
      setResults(await evaluate(question, answer, techniques, techniques.length === 1 ? prompt : null, settings));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card rail>
      <Eyebrow>Prompt evaluation</Eyebrow>
      <p className="mb-4 text-[13px] text-secondary">Compare prompting strategies on a sample answer before shipping one.</p>

      <RadioGroup columns={2} value={technique} options={TECHNIQUES} onChange={(v) => { setTechnique(v); setPrompt(null); }} />

      <div className="mt-4">
        <span className="font-display text-[14px] font-semibold text-ink">System prompt</span>
        <div className="mt-1.5"><Textarea value={prompt ?? COACH_PROMPTS[technique]} onChange={setPrompt} rows={5} /></div>
        <p className="mt-1 text-[12px] text-muted">Editable copy of the {TECH_LABEL[technique]} template (used only for a single run).</p>
      </div>

      <div className="mt-4 rounded-[8px] bg-line-subtle p-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-[13px] font-semibold text-ink">Test case</span>
          <button type="button" onClick={() => { setQuestion(EXAMPLE.question); setAnswer(EXAMPLE.answer); }} className="text-[12px] font-medium text-accent hover:underline">Load example</button>
        </div>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Sample question"
          className="mt-2 w-full rounded-[8px] border border-line bg-white px-3 py-2 text-[14px] text-ink outline-none focus:border-accent" />
        <div className="mt-2"><Textarea value={answer} onChange={setAnswer} rows={4} placeholder="Sample answer" /></div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button onClick={() => run([technique])} loading={loading}>Run evaluation</Button>
        <Button variant="ghost" onClick={() => run(TECHNIQUES.map((t) => t.value))} disabled={loading}>Compare all {TECHNIQUES.length}</Button>
      </div>

      {error && <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      {results && (
        <div className="mt-4 flex flex-col gap-2">
          {[...results].sort((a, b) => (b.feedback ? overallScore(b.feedback) : -1) - (a.feedback ? overallScore(a.feedback) : -1)).map((r) => (
            <div key={r.technique} className="rounded-[8px] border border-line p-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-[14px] font-semibold text-ink">{TECH_LABEL[r.technique] ?? r.technique}</span>
                {r.feedback ? (
                  <span className="font-mono text-[14px] font-bold text-accent">{overallScore(r.feedback)}<span className="text-muted">/100</span></span>
                ) : (
                  <span className="text-[12px] text-red-600">{r.error}</span>
                )}
              </div>
              {r.feedback && (
                <div className="mt-1 text-[12px] text-secondary">
                  {STAR.map((k) => `${cap(k)} ${r.feedback![k].score}`).join(" · ")} — {r.feedback.overall}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
