"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import QuestionCard from "@/components/ui/QuestionCard";
import { analyze, type Analysis, type Question } from "@/lib/api";
import { useBank } from "@/lib/bank";

export default function JDAnalyserPage() {
  const router = useRouter();
  const { addQuestions } = useBank();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setLoading(true);
    try {
      const res = await analyze(jd);
      setAnalysis(res.analysis);
      setQuestions(res.questions);
      addQuestions(res.questions);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }
  const practice = (q: Question) =>
    router.push(`/mock-interview?${new URLSearchParams({ q: q.question, category: q.category })}`);

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <p className="max-w-[560px] text-[14px] text-secondary">Paste a job description to get tailored interview questions.</p>
      <Card>
        <Textarea label="Job description" value={jd} onChange={setJd} rows={8} placeholder="Paste the role's job description…" />
        <div className="mt-4"><Button onClick={run} loading={loading} disabled={!jd.trim()}>Analyze &amp; generate questions</Button></div>
      </Card>
      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}
      {analysis && (
        <>
          <Card>
            <div className="font-display text-[15px] font-semibold text-ink">Key skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {analysis.key_skills.map((s) => <span key={s} className="rounded-full bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700">{s}</span>)}
            </div>
          </Card>
          {questions.map((q) => <QuestionCard key={q.id} {...q} onPractice={() => practice(q)} />)}
        </>
      )}
    </div>
  );
}
