import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import QuestionCard from "@/components/ui/QuestionCard";
import type { Analysis, Question } from "@/lib/api";

export default function QuestionsStep({ analysis, questions, onOpen }: {
  analysis: Analysis; questions: Question[]; onOpen: (i: number) => void;
}) {
  return (
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
          <div className="text-[13px] text-secondary">Click a question to practice it.</div>
        </div>
      </div>
      {questions.map((question, i) => (
        <QuestionCard key={question.id} category={question.category} difficulty={question.difficulty} question={question.question} meta="Tailored to JD" onPractice={() => onOpen(i)} />
      ))}
    </>
  );
}
