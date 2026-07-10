import { askLlm, type LlmOpts } from "./openrouter";
import { COACH_PROMPTS, ANALYZE_PROMPT, generatePrompt, CRITIQUE_PROMPT } from "./prompts";

const clean = (s: string) => s.trim().replace(/```json/g, "").replace(/```/g, "").trim();

export async function analyzeJobDescription(jd: string, g: LlmOpts) {
  return JSON.parse(clean(await askLlm(ANALYZE_PROMPT, jd, g)));
}

export async function generateQuestions(topics: string[], seniority: string, g: LlmOpts, n = 5) {
  const raw = await askLlm(generatePrompt(topics, seniority, n), "Generate the interview questions now.", g);
  const parsed = JSON.parse(clean(raw));
  return (parsed.questions ?? parsed) as { question: string; category: string; difficulty: string; meta: string }[];
}

export async function coachAnswer(question: string, answer: string, technique: string, selfCritique: boolean, g: LlmOpts) {
  const system = COACH_PROMPTS[technique] ?? COACH_PROMPTS.chain_of_thought;
  let result = JSON.parse(clean(await askLlm(system, `Question: ${question}\n\nMy answer: ${answer}`, g)));
  if (selfCritique) {
    const raw = await askLlm(CRITIQUE_PROMPT, `Question: ${question}\n\nAnswer: ${answer}\n\nDraft evaluation:\n${JSON.stringify(result)}`, g);
    result = JSON.parse(clean(raw));
  }
  return result;
}
