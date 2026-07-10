import type { GenerationSettings } from "./settings";

export type Analysis = { key_skills: string[]; interview_topics: string[]; seniority: string };
export type Question = { id: number; question: string; category: string; difficulty: "Easy" | "Medium" | "Hard"; meta: string };
export type StarPart = { feedback: string; score: number };
export type Feedback = { situation: StarPart; task: StarPart; action: StarPart; result: StarPart; overall: string };

export async function analyze(jd: string, settings: GenerationSettings) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription: jd, settings }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Request failed");
  return { analysis: data.analysis as Analysis, questions: data.questions as Question[] };
}

export async function coachAnswer(question: string, answer: string, settings: GenerationSettings, technique: string, selfCritique: boolean) {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer, technique, selfCritique, settings }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Request failed");
  return data.feedback as Feedback;
}
