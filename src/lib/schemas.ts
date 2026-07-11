import { z } from "zod";

export const SettingsSchema = z.object({
  model: z.string(),
  technique: z.string().default("chain_of_thought"),
  temperature: z.number().min(0).max(2).default(0.4),
  maxTokens: z.number().int().positive().default(1024),
  reasoning: z.enum(["minimal", "low", "medium", "high"]).catch("medium"),
  selfCritique: z.boolean().default(false),
  customPrompt: z.string().nullable().catch(null),
});

// Incoming request bodies
export const AnalyzeRequest = z.object({
  jobDescription: z.string().trim().min(40, "Please provide a longer job description (at least 40 characters)."),
  settings: SettingsSchema,
});
export const CoachRequest = z.object({
  question: z.string().trim().min(1, "Missing question."),
  answer: z.string().trim().min(15, "Your answer is too short — please add more detail."),
  technique: z.string().default("chain_of_thought"),
  selfCritique: z.boolean().default(false),
  settings: SettingsSchema,
});

// Model output shapes
export const AnalysisSchema = z.object({
  key_skills: z.array(z.string()),
  interview_topics: z.array(z.string()),
  seniority: z.string(),
});
export const QuestionsSchema = z.object({
  questions: z
    .array(z.object({ question: z.string(), category: z.string(), difficulty: z.string(), meta: z.string() }))
    .min(1),
});
const Star = z.object({ feedback: z.string(), score: z.coerce.number() });
export const FeedbackSchema = z.object({
  situation: Star,
  task: Star,
  action: Star,
  result: Star,
  overall: z.string(),
});
