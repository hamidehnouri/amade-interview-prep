"use client";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
    setError("");
    setLoading(true);
    try {
      const res = await analyze(jd, settings);
      setAnalysis(res.analysis);
      setQuestions(res.questions);
      setStep("questions");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }
  function openQuestion(i: number) {
    setSelected(i);
    setAnswer("");
    setFeedback(null);
    setStep("practice");
  }
  async function runFeedback() {
    setError("");
    setLoading(true);
    try {
      setFeedback(await coachAnswer(q.question, answer, settings, settings.technique, settings.selfCritique));
      setStep("score");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-6">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${i <= stepIndex ? "bg-accent text-white" : "bg-line-subtle text-muted"}`}>{i + 1}</div>
            <span className={`text-[13px] font-medium ${i === stepIndex ? "text-ink" : "text-muted"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className="mx-1 h-px w-6 bg-line" />}
          </div>
        ))}
      </div>

      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}

      {step === "analyse" && <AnalyseStep jd={jd} onChange={setJd} />}
      {step === "questions" && analysis && <QuestionsStep analysis={analysis} questions={questions} onOpen={openQuestion} />}
      {step === "practice" && q && <PracticeStep question={q} answer={answer} onChange={setAnswer} />}
      {step === "score" && feedback && q && <ScoreStep question={q} feedback={feedback} />}

      <div className="flex items-center justify-between">
        <div>
          {step === "questions" && <NavBtn dir="prev" onClick={() => setStep("analyse")}>Back</NavBtn>}
          {step === "practice" && <NavBtn dir="prev" onClick={() => setStep("questions")}>Back to questions</NavBtn>}
          {step === "score" && <NavBtn dir="prev" onClick={() => setStep("practice")}>Revise answer</NavBtn>}
        </div>
        <div>
          {step === "analyse" && (
            <Button onClick={runAnalyse} loading={loading} disabled={!jd.trim()}>
              <Sparkles size={16} /> Analyse &amp; generate
            </Button>
          )}
          {step === "practice" && (
            <Button onClick={runFeedback} loading={loading} disabled={!answer.trim()}>Submit &amp; get feedback</Button>
          )}
          {step === "score" &&
            (selected < questions.length - 1 ? (
              <NavBtn dir="next" onClick={() => openQuestion(selected + 1)}>Next question</NavBtn>
            ) : (
              <NavBtn dir="next" onClick={() => setStep("questions")}>Back to questions</NavBtn>
            ))}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ dir, onClick, children }: { dir: "prev" | "next"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-[10px] border border-line px-4 py-2.5 font-display text-[14px] font-semibold text-secondary transition-colors hover:bg-line-subtle">
      {dir === "prev" && <ChevronLeft size={16} />}
      {children}
      {dir === "next" && <ChevronRight size={16} />}
    </button>
  );
}
