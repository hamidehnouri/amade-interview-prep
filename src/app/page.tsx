"use client";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Stepper from "@/components/ui/Stepper";
import AnalyseStep from "@/components/steps/AnalyseStep";
import QuestionsStep from "@/components/steps/QuestionsStep";
import PracticeStep from "@/components/steps/PracticeStep";
import ScoreStep from "@/components/steps/ScoreStep";
import { analyze, coachAnswer } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { useWizard, setWizard, type Step } from "@/lib/wizardStore";

const STEPS: { key: Step; label: string }[] = [
  { key: "analyse", label: "Analyse" },
  { key: "questions", label: "Questions" },
  { key: "practice", label: "Practice" },
  { key: "score", label: "Score" },
];
const PREV: Record<Step, Step | null> = { analyse: null, questions: "analyse", practice: "questions", score: "practice" };
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

export default function Home() {
  const { settings } = useSettings();
  const w = useWizard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const q = w.questions[w.selected];
  const stepIndex = STEPS.findIndex((s) => s.key === w.step);
  const reachable = [true, !!w.analysis, w.questions.length > 0, !!w.feedback];
  const practicedCount = Object.keys(w.results).length;

  function onJdChange(v: string) {
    if (w.analysis || w.questions.length || w.feedback) {
      setWizard({ jd: v, analysis: null, questions: [], selected: 0, answer: "", feedback: null, results: {} });
    } else {
      setWizard({ jd: v });
    }
  }
  async function runAnalyse() {
    setError(""); setLoading(true);
    try {
      const res = await analyze(w.jd, settings);
      setWizard({ analysis: res.analysis, questions: res.questions, results: {}, selected: 0, answer: "", feedback: null, step: "questions" });
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }
  function openQuestion(i: number) { setWizard({ selected: i, answer: "", feedback: null, step: "practice" }); }
  async function runFeedback() {
    setError(""); setLoading(true);
    try {
      const fb = await coachAnswer(q.question, w.answer, settings, settings.technique, settings.selfCritique);
      setWizard({ feedback: fb, results: { ...w.results, [q.id]: fb }, step: "score" });
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-6">
      <Stepper steps={STEPS} current={stepIndex} reachable={reachable} onStepClick={(i) => setWizard({ step: STEPS[i].key })} className="mb-4" />

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      <div className="flex min-h-[540px] flex-col gap-6">
        {w.step === "analyse" && <AnalyseStep jd={w.jd} onChange={onJdChange} />}
        {w.step === "questions" && w.analysis && <QuestionsStep analysis={w.analysis} questions={w.questions} results={w.results} onOpen={openQuestion} />}
        {w.step === "practice" && q && <PracticeStep question={q} practicedCount={practicedCount} total={w.questions.length} answer={w.answer} onChange={(v) => setWizard({ answer: v })} />}
        {w.step === "score" && w.feedback && q && <ScoreStep question={q} feedback={w.feedback} />}
      </div>

      <div className="relative flex items-center justify-between border-t border-line pt-5">
        <div>
          {PREV[w.step] && <NavBtn dir="prev" onClick={() => setWizard({ step: PREV[w.step]! })}>Previous</NavBtn>}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[12px] text-muted">Step {stepIndex + 1} of {STEPS.length}</div>
        <div className="flex justify-end">
          {w.step === "analyse" && (
            <Button onClick={runAnalyse} loading={loading} disabled={!w.jd.trim()}>
              <Sparkles size={16} /> Analyse &amp; generate
            </Button>
          )}
          {w.step === "questions" && (
            <Button onClick={() => openQuestion(0)} disabled={w.questions.length === 0}>
              Start practice <ChevronRight size={16} />
            </Button>
          )}
          {w.step === "practice" && (
            <Button onClick={runFeedback} loading={loading} disabled={!w.answer.trim()}>
              Submit &amp; see score <ChevronRight size={16} />
            </Button>
          )}
          {w.step === "score" && (
            <div className="flex flex-col items-end gap-2">
              <NavBtn onClick={() => setWizard({ answer: "", feedback: null, step: "practice" })}>Retry this question</NavBtn>
              <NavBtn dir="next" onClick={() => setWizard({ step: "questions" })}>All questions</NavBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ dir, onClick, disabled, children }: { dir?: "prev" | "next"; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Button variant="ghost" onClick={onClick} disabled={disabled}>
      {dir === "prev" && <ChevronLeft size={16} />}
      {children}
      {dir === "next" && <ChevronRight size={16} />}
    </Button>
  );
}
