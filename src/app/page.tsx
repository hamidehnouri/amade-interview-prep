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

  function onJdChange(v: string) {
    if (w.analysis || w.questions.length || w.feedback) {
      setWizard({ jd: v, analysis: null, questions: [], selected: 0, answer: "", feedback: null });
    } else {
      setWizard({ jd: v });
    }
  }
  async function runAnalyse() {
    setError(""); setLoading(true);
    try {
      const res = await analyze(w.jd, settings);
      setWizard({ analysis: res.analysis, questions: res.questions, step: "questions" });
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }
  function openQuestion(i: number) { setWizard({ selected: i, answer: "", feedback: null, step: "practice" }); }
  async function runFeedback() {
    setError(""); setLoading(true);
    try {
      const fb = await coachAnswer(q.question, w.answer, settings, settings.technique, settings.selfCritique);
      setWizard({ feedback: fb, step: "score" });
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-6">
      <Stepper steps={STEPS} current={stepIndex} reachable={reachable} onStepClick={(i) => setWizard({ step: STEPS[i].key })} className="mb-4" />

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      <div className="flex min-h-[540px] flex-col gap-6">
        {w.step === "analyse" && <AnalyseStep jd={w.jd} onChange={onJdChange} />}
        {w.step === "questions" && w.analysis && <QuestionsStep analysis={w.analysis} questions={w.questions} onOpen={openQuestion} />}
        {w.step === "practice" && q && <PracticeStep question={q} index={w.selected} total={w.questions.length} answer={w.answer} onChange={(v) => setWizard({ answer: v })} />}
        {w.step === "score" && w.feedback && q && <ScoreStep question={q} feedback={w.feedback} />}
      </div>

      <div className="flex items-center border-t border-line pt-5">
        <div className="flex flex-1 justify-start">
          <NavBtn dir="prev" disabled={!PREV[w.step]} onClick={() => PREV[w.step] && setWizard({ step: PREV[w.step]! })}>Previous</NavBtn>
        </div>
        <div className="flex-1 text-center font-mono text-[12px] text-muted">Step {stepIndex + 1} of {STEPS.length}</div>
        <div className="flex flex-1 justify-end gap-3">
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
            <>
              <NavBtn onClick={() => setWizard({ answer: "", feedback: null, step: "practice" })}>Retry</NavBtn>
              <NavBtn dir="next" onClick={() => (w.selected < w.questions.length - 1 ? openQuestion(w.selected + 1) : setWizard({ step: "questions" }))}>Next</NavBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ dir, onClick, disabled, children }: { dir?: "prev" | "next"; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-[10px] border border-line px-4 py-2.5 font-display text-[14px] font-semibold text-secondary transition-colors hover:bg-line-subtle disabled:cursor-not-allowed disabled:opacity-40">
      {dir === "prev" && <ChevronLeft size={16} />}
      {children}
      {dir === "next" && <ChevronRight size={16} />}
    </button>
  );
}
