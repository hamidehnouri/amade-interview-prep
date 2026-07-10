"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Target, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Eyebrow from "@/components/ui/Eyebrow";
import QuestionCard from "@/components/ui/QuestionCard";
import { analyze, type Analysis, type Question } from "@/lib/api";
import { useSettings } from "@/lib/settings";

export default function JDAnalyserPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setLoading(true);
    try {
      const res = await analyze(jd, settings);
      setAnalysis(res.analysis);
      setQuestions(res.questions);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  const practice = (q: Question) =>
    router.push(`/practice-interview?${new URLSearchParams({ q: q.question, category: q.category })}`);

  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left — input */}
      <Card>
        <Eyebrow>Paste a job description</Eyebrow>
        <Textarea value={jd} onChange={setJd} rows={12} placeholder="Paste the role's job description…" />
        <div className="mt-4">
          <Button onClick={run} loading={loading} disabled={!jd.trim()} className="w-full">
            <Sparkles size={16} /> Analyse &amp; generate questions
          </Button>
        </div>
        {error && <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}
      </Card>

      {/* Right — empty state or results */}
      <div className="flex flex-col gap-6">
        {!analysis ? (
          <Card className="flex flex-1 flex-col items-center justify-center gap-2 py-14 text-center">
            <Target className="text-accent" size={28} />
            <div className="font-display text-[17px] font-semibold text-ink">Your tailored set appears here</div>
            <p className="max-w-[300px] text-[13px] text-secondary">We extract the role&apos;s key skills and generate questions that mirror what this interviewer will ask.</p>
          </Card>
        ) : (
          <>
            <Card>
              <Eyebrow badge={`${analysis.key_skills.length} skills`}>Extracted focus areas</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {analysis.key_skills.map((s) => (
                  <span key={s} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink">{s}</span>
                ))}
              </div>
            </Card>
            <div className="flex items-start gap-3 rounded-[8px] border border-blue-200 bg-blue-50 p-4">
              <Check className="mt-0.5 shrink-0 text-accent" size={18} />
              <div>
                <div className="font-display text-[14px] font-semibold text-ink">{questions.length} questions generated</div>
                <div className="text-[13px] text-secondary">Based on the extracted focus areas.</div>
              </div>
            </div>
            {questions.map((q) => (
              <QuestionCard key={q.id} category={q.category} difficulty={q.difficulty} question={q.question} meta="Tailored to JD" onPractice={() => practice(q)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
