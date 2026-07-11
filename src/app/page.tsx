"use client";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import AnalyseStep from "@/components/steps/AnalyseStep";
import QuestionsStep from "@/components/steps/QuestionsStep";
import PracticeStep from "@/components/steps/PracticeStep";
import ScoreStep from "@/components/steps/ScoreStep";
import { analyze, coachAnswer, type Analysis, type Question, type Feedback } from "@/lib/api";
import { useSettings } from "@/lib/settings";

type Step = "analyse" | "questions" | "practice" | "score";
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
  const [step, setStep] = useState<Step>("analyse");
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const q = questions[selected];
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  async function runAnalyse() {
    setError(""); setLoading(true);
    try {
      const res = await analyze(jd, settings);
      setAnalysis(res.analysis); setQuestions(res.questions); setStep("questions");
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }
  function openQuestion(i: number) { setSelected(i); setAnswer(""); setFeedback(null); setStep("practice"); }
  async function runFeedback() {
    setError(""); setLoading(true);
    try {
      setFeedback(await coachAnswer(q.question, answer, settings, settings.technique, settings.selfCritique));
      setStep("score");
    } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-6">
      {/* Stepper — click a passed step to go back */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const reached = i <= stepIndex;
          const done = i < stepIndex;
          return (
            <div key={s.key} className="flex flex-1 items-center gap-2 last:flex-none">
              <button
                type="button"
                disabled={!reached}
                onClick={() => reached && setStep(s.key)}
                className="flex items-center gap-2 disabled:cursor-default"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${reached ? "bg-accent text-white" : "bg-line-subtle text-muted"}`}>
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span className={`text-[13px] font-medium ${i === stepIndex ? "text-ink" : reached ? "text-secondary hover:text-ink" : "text-muted"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-line" />}
            </div>
          );
        })}
      </div>

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      {step === "analyse" && <AnalyseStep jd={jd} onChange={setJd} />}
      {step === "questions" && analysis && <QuestionsStep analysis={analysis} questions={questions} onOpen={openQuestion} />}
      {step === "practice" && q && <PracticeStep question={q} index={selected} total={questions.length} answer={answer} onChange={setAnswer} />}
      {step === "score" && feedback && q && <ScoreStep question={q} feedback={feedback} />}

      <div className="flex items-center border-t border-line pt-5">
        <div className="flex flex-1 justify-start">
          <NavBtn dir="prev" disabled={!PREV[step]} onClick={() => PREV[step] && setStep(PREV[step]!)}>Previous</NavBtn>
        </div>
        <div className="flex-1 text-center font-mono text-[12px] text-muted">Step {stepIndex + 1} of {STEPS.length}</div>
        <div className="flex flex-1 justify-end gap-3">
          {step === "analyse" && (
            <Button onClick={runAnalyse} loading={loading} disabled={!jd.trim()}>
              <Sparkles size={16} /> Analyse &amp; generate
            </Button>
          )}
          {step === "questions" && (
            <Button onClick={() => openQuestion(0)} disabled={questions.length === 0}>
              Start practice <ChevronRight size={16} />
            </Button>
          )}
          {step === "practice" && (
            <Button onClick={runFeedback} loading={loading} disabled={!answer.trim()}>
              Submit &amp; see score <ChevronRight size={16} />
            </Button>
          )}
          {step === "score" && (
            <>
              <NavBtn onClick={() => { setAnswer(""); setFeedback(null); setStep("practice"); }}>Retry</NavBtn>
              <NavBtn dir="next" onClick={() => (selected < questions.length - 1 ? openQuestion(selected + 1) : setStep("questions"))}>Next</NavBtn>
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
