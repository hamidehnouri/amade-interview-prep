import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Callout from "@/components/ui/Callout";
import Eyebrow from "@/components/ui/Eyebrow";
import StepHeader from "@/components/ui/StepHeader";
import QuestionCard from "@/components/ui/QuestionCard";
import FocusAreas from "@/components/ui/FocusAreas";
import { overallScore } from "@/lib/score";
import type { Analysis, Question, Feedback } from "@/lib/api";

export default function QuestionsStep({ analysis, questions, results, onOpen }: {
  analysis: Analysis; questions: Question[]; results: Record<number, Feedback>; onOpen: (i: number) => void;
}) {
  return (
    <>
      <StepHeader n={2} title="Your tailored questions" subtitle="Pick a question to practise — click any card to start." />
      <Card>
        <Eyebrow badge={`${analysis.key_skills.length} skills`}>Extracted focus areas</Eyebrow>
        <FocusAreas skills={analysis.key_skills} />
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
