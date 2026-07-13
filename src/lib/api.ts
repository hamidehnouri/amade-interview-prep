import type { GenerationSettings } from "./settings";
import { getApiKey } from "./apiKey";

export type Analysis = { key_skills: string[]; interview_topics: string[]; seniority: string };
export type Question = { id: number; question: string; category: string; difficulty: "Easy" | "Medium" | "Hard"; meta: string };
export type StarPart = { feedback: string; score: number };
export type Feedback = { situation: StarPart; task: StarPart; action: StarPart; result: StarPart; overall: string };

// Build request headers, attaching the user's own API key (BYOK) so it travels
// only in a header — never in the JSON body, and never persisted server-side.
function headers(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const key = getApiKey();
  if (key) h["x-openrouter-key"] = key;
  return h;
}

export async function analyze(jd: string, settings: GenerationSettings) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ jobDescription: jd, settings }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Request failed");
  return { analysis: data.analysis as Analysis, questions: data.questions as Question[] };
}

export async function coachAnswer(question: string, answer: string, settings: GenerationSettings, technique: string, selfCritique: boolean) {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ question, answer, technique, selfCritique, settings }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Request failed");
  return data.feedback as Feedback;
}

export type EvalResult = { technique: string; feedback?: Feedback; error?: string };
export async function evaluate(question: string, answer: string, techniques: string[], systemPrompt: string | null, settings: GenerationSettings) {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ question, answer, techniques, systemPrompt, settings }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Evaluation failed");
  return data.results as EvalResult[];
}
