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

export async function generateQuestions(topics: string[], seniority: string, g: LlmOpts, n = 8) {
  const parsed = toJson(await askLlm(generatePrompt(topics, seniority, n), "Generate the interview questions now.", g), "the questions");
  const r = QuestionsSchema.safeParse(Array.isArray(parsed) ? { questions: parsed } : parsed);
  if (!r.success) throw new Error("No valid questions were generated — try again.");
  return r.data.questions;
}

export async function coachAnswer(question: string, answer: string, technique: string, selfCritique: boolean, g: LlmOpts, systemPromptOverride: string | null = null) {
  const system = systemPromptOverride && systemPromptOverride.trim() ? systemPromptOverride : (COACH_PROMPTS[technique] ?? COACH_PROMPTS.chain_of_thought);
  const first = FeedbackSchema.safeParse(toJson(await askLlm(system, `Question: ${question}\n\nMy answer: ${answer}`, g), "the feedback"));
  if (!first.success) throw new Error("The feedback came back incomplete — try again or raise Max output tokens.");
  let result = first.data;

  if (selfCritique) {
    // Best-effort: refine only if the critique pass returns a valid evaluation; otherwise keep the first.
    try {
      const review = FeedbackSchema.safeParse(
        toJson(await askLlm(CRITIQUE_PROMPT, `Question: ${question}\n\nAnswer: ${answer}\n\nDraft evaluation:\n${JSON.stringify(result)}`, g), "the feedback")
      );
      if (review.success) result = review.data;
    } catch {
      /* keep the valid first pass */
    }
  }
  return result;
}
