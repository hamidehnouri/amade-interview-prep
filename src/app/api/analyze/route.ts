import { NextResponse } from "next/server";
import { ruleGuard } from "@/lib/guard";
import { analyzeJobDescription, generateQuestions } from "@/lib/features";
import { AnalyzeRequest } from "@/lib/schemas";
import { isReasoningModel } from "@/lib/models";

export async function POST(req: Request) {
  const parsed = AnalyzeRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request." });
  const { jobDescription, settings } = parsed.data;

  const guard = ruleGuard(jobDescription);
  if (!guard.safe) return NextResponse.json({ ok: false, error: guard.reason });

  const g = {
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    reasoningEffort: isReasoningModel(settings.model) ? settings.reasoning : null,
  };
  try {
    const analysis = await analyzeJobDescription(jobDescription, g);
    const raw = await generateQuestions(analysis.interview_topics, analysis.seniority, g);
    return NextResponse.json({ ok: true, analysis, questions: raw.map((q, i) => ({ id: i + 1, ...q })) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) });
  }
}
