"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import Eyebrow from "@/components/ui/Eyebrow";
import StepHeader from "@/components/ui/StepHeader";
import QuestionCard from "@/components/ui/QuestionCard";
import { overallScore } from "@/lib/score";
import type { Analysis, Question, Feedback } from "@/lib/api";

// Rough single-line fit for the focus chips (pre-responsive; ~800px card).
const CHAR = 6.7, PAD = 30, GAP = 8, BUDGET = 800, RESERVE = 100;
function fitCount(skills: string[]) {
  let used = 0, count = 0;
  for (const s of skills) {
    const w = s.length * CHAR + PAD;
    const next = used + (count ? GAP : 0) + w;
    if (next > BUDGET - RESERVE) break;
    used = next; count++;
  }
  return Math.max(1, count);
}

export default function QuestionsStep({ analysis, questions, results, onOpen }: {
  analysis: Analysis; questions: Question[]; results: Record<number, Feedback>; onOpen: (i: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const skills = analysis.key_skills;
  const fit = fitCount(skills);
  const shown = expanded ? skills : skills.slice(0, fit);
  const hidden = skills.length - fit;

  return (
    <>
      <StepHeader n={2} title="Your tailored questions" subtitle="Pick a question to practise — click any card to start." />
      <Card>
        <Eyebrow badge={`${skills.length} skills`}>Extracted focus areas</Eyebrow>
        <div className="flex flex-wrap items-center gap-2">
          {shown.map((s) => (
            <span key={s} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink">{s}</span>
          ))}
          {!expanded && hidden > 0 && (
            <button type="button" onClick={() => setExpanded(true)} className="px-1 text-[13px] font-medium text-accent hover:underline">+{hidden} more</button>
          )}
          {expanded && skills.length > fit && (
            <button type="button" onClick={() => setExpanded(false)} className="px-1 text-[13px] font-medium text-accent hover:underline">Show less</button>
          )}
        </div>
      </Card>
      <Callout className="flex items-start gap-3">
        <Check className="mt-0.5 shrink-0 text-accent" size={18} />
        <div>
          <div className="font-display text-[14px] font-semibold text-ink">{questions.length} questions generated</div>
          <div className="text-[13px] text-secondary">Click a question to practice it.</div>
        </div>
      </Callout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {questions.map((question, i) => {
          const fb = results[question.id];
          return (
            <QuestionCard key={question.id} category={question.category} difficulty={question.difficulty} question={question.question} meta="Tailored to JD" score={fb ? overallScore(fb) : null} onPractice={() => onOpen(i)} />
          );
        })}
      </div>
    </>
  );
}
