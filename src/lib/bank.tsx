"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Question } from "./api";

export type BankQuestion = Question & { practiced: boolean };
type Ctx = { questions: BankQuestion[]; addQuestions: (qs: Question[]) => void; markPracticed: (question: string) => void };
const BankContext = createContext<Ctx | null>(null);
const KEY = "amade.bank";

export function QuestionBankProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  useEffect(() => {
    try { const raw = sessionStorage.getItem(KEY); if (raw) setQuestions(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(questions)); } catch {}
  }, [questions]);

  function addQuestions(qs: Question[]) {
    setQuestions((prev) => {
      const seen = new Set(prev.map((q) => q.question));
      return [...prev, ...qs.filter((q) => !seen.has(q.question)).map((q) => ({ ...q, practiced: false }))];
    });
  }
  function markPracticed(question: string) {
    setQuestions((prev) => prev.map((q) => (q.question === question ? { ...q, practiced: true } : q)));
  }
  return <BankContext.Provider value={{ questions, addQuestions, markPracticed }}>{children}</BankContext.Provider>;
}
export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within QuestionBankProvider");
  return ctx;
}
