export type Analysis = { key_skills: string[]; interview_topics: string[]; seniority: string };
export type StarPart = { feedback: string; score: number };
export type Feedback = { situation: StarPart; task: StarPart; action: StarPart; result: StarPart; overall: string };

// TODO(Step 6): replace mocks with fetch() to /api/analyze and /api/coach.
export async function analyze(_jd: string): Promise<{ analysis: Analysis; questions: string[] }> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    analysis: { key_skills: ["Python", "APIs", "Prompt design"], interview_topics: ["LLMs"], seniority: "mid" },
    questions: [
      "Tell me about a time you shipped an LLM feature end to end.",
      "How do you evaluate prompt quality?",
      "Describe a debugging challenge with an API integration.",
    ],
  };
}
export async function coachAnswer(_q: string, _a: string): Promise<Feedback> {
  await new Promise((r) => setTimeout(r, 500));
  const p = (score: number, feedback: string) => ({ score, feedback });
  return {
    situation: p(6, "Good context; could add scale."),
    task: p(7, "Clear objective."),
    action: p(7, "Concrete steps described."),
    result: p(5, "Add a measurable outcome."),
    overall: "Solid STAR structure — quantify the result.",
  };
}
