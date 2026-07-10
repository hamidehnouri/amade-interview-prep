"use client";
import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { coachAnswer, type Feedback } from "@/lib/api";
import { useBank } from "@/lib/bank";
import { useSettings } from "@/lib/settings";

const STAR = ["situation", "task", "action", "result"] as const;

export default function MockInterview({ question, category }: { question: string; category?: string }) {
  const { markPracticed } = useBank();
  const { settings } = useSettings();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState("");

  if (!question) {
    return (
      <p className="text-secondary">
        No question selected — go to the <Link href="/" className="text-accent underline">JD analyser</Link> or{" "}
        <Link href="/question-bank" className="text-accent underline">Question bank</Link> and pick one.
      </p>
    );
  }

  async function submit() {
    setError("");
    setLoading(true);
    try {
      setFeedback(await coachAnswer(question, answer, settings, settings.technique, settings.selfCritique));
      markPracticed(question);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <Card>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">AI Interviewer</span>
          {category && <span className="rounded-[8px] border border-blue-200 bg-blue-50 px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] text-blue-700">{category}</span>}
        </div>
        <div className="mt-3 font-display text-[18px] font-semibold leading-snug text-ink">{question}</div>
      </Card>
      <Card>
        <Textarea label="Your answer" value={answer} onChange={setAnswer} rows={8} placeholder="Type your answer here…" />
        <div className="mt-4 flex gap-3">
          <Button onClick={submit} loading={loading} disabled={!answer.trim()}>Submit &amp; get feedback</Button>
          <Link href="/question-bank" className="inline-flex items-center rounded-[10px] border border-line px-5 py-2.5 font-display text-[14px] font-semibold text-secondary hover:bg-line-subtle">Question bank</Link>
        </div>
      </Card>
      {error && <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{error}</div>}
      {feedback && (
        <Card>
          <div className="font-display text-[15px] font-semibold text-ink">STAR feedback</div>
          <div className="mt-3 flex flex-col gap-2">
            {STAR.map((part) => (
              <div key={part} className="text-[14px]">
                <span className="font-semibold capitalize text-ink">{part}: {feedback[part].score}/10</span>
                <span className="text-secondary"> — {feedback[part].feedback}</span>
              </div>
            ))}
            <div className="mt-1 rounded-[8px] bg-blue-50 p-3 text-[14px] text-blue-700">{feedback.overall}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
