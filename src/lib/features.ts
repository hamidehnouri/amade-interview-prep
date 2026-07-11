import { askLlm, type LlmOpts } from "./openrouter";
import { COACH_PROMPTS, ANALYZE_PROMPT, generatePrompt, CRITIQUE_PROMPT } from "./prompts";
import { AnalysisSchema, QuestionsSchema, FeedbackSchema } from "./schemas";

const clean = (s: string) => s.trim().replace(/```json/g, "").replace(/```/g, "").trim();

function toJson(raw: string, what: string) {
  try { return JSON.parse(clean(raw)); }
  catch { throw new Error(`The model didn't return valid JSON for ${what}. Try again or raise Max output tokens.`); }
}

export async function analyzeJobDescription(jd: string, g: LlmOpts) {
  const r = AnalysisSchema.safeParse(toJson(await askLlm(ANALYZE_PROMPT, jd, g), "the analysis"));
  if (!r.success) throw new Error("The analysis came back incomplete — try a fuller job description.");
  return r.data;
}

export async function generateQuestions(topics: string[], seniority: string, g: LlmOpts, n = 5) {
  const parsed = toJson(await askLlm(generatePrompt(topics, seniority, n), "Generate the interview questions now.", g), "the questions");
  const r = QuestionsSchema.safeParse(Array.isArray(parsed) ? { questions: parsed } : parsed);
  if (!r.success) throw new Error("No valid questions were generated — try again.");
  return r.data.questions;
}

export async function coachAnswer(question: string, answer: string, technique: string, selfCritique: boolean, g: LlmOpts) {
  const system = COACH_PROMPTS[technique] ?? COACH_PROMPTS.chain_of_thought;
  let parsed = toJson(await askLlm(system, `Question: ${question}\n\nMy answer: ${answer}`, g), "the feedback");
  if (selfCritique) {
    parsed = toJson(await askLlm(CRITIQUE_PROMPT, `Question: ${question}\n\nAnswer: ${answer}\n\nDraft evaluation:\n${JSON.stringify(parsed)}`, g), "the feedback");
  }
  const r = FeedbackSchema.safeParse(parsed);
  if (!r.success) throw new Error("The feedback came back incomplete — try again or raise Max output tokens.");
  return r.data;
}
