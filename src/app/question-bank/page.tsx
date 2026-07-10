"use client";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/ui/QuestionCard";
import { useBank } from "@/lib/bank";

export default function QuestionBankPage() {
  const router = useRouter();
  const { questions } = useBank();
  if (questions.length === 0) {
    return <p className="text-secondary">No questions yet — generate some in the JD analyser.</p>;
  }
  const practiced = questions.filter((q) => q.practiced).length;
  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-4">
      <p className="text-[14px] text-secondary">{practiced} of {questions.length} practiced.</p>
      {questions.map((q) => (
        <QuestionCard
          key={q.question}
          {...q}
          onPractice={() => router.push(`/mock-interview?${new URLSearchParams({ q: q.question, category: q.category })}`)}
        />
      ))}
    </div>
  );
}
