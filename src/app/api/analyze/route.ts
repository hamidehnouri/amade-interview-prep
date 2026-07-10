import { NextResponse } from "next/server";
import { ruleGuard } from "@/lib/guard";
import { analyzeJobDescription, generateQuestions } from "@/lib/features";

export async function POST(req: Request) {
  const { jobDescription, settings } = await req.json();
  const guard = ruleGuard(jobDescription ?? "");
  if (!guard.safe) return NextResponse.json({ ok: false, error: guard.reason });

  const g = { model: settings.model, temperature: settings.temperature, maxTokens: settings.maxTokens, reasoningEffort: settings.reasoning };
  try {
    const analysis = await analyzeJobDescription(jobDescription, g);
    const raw = await generateQuestions(analysis.interview_topics, analysis.seniority, g);
    const questions = raw.map((q, i) => ({ id: i + 1, ...q }));
    return NextResponse.json({ ok: true, analysis, questions });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
