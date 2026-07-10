import { NextResponse } from "next/server";
import { ruleGuard } from "@/lib/guard";
import { coachAnswer } from "@/lib/features";

export async function POST(req: Request) {
  const { question, answer, technique, selfCritique, settings } = await req.json();
  const guard = ruleGuard(answer ?? "");
  if (!guard.safe) return NextResponse.json({ ok: false, error: guard.reason });

  const g = { model: settings.model, temperature: settings.temperature, maxTokens: settings.maxTokens, reasoningEffort: settings.reasoning };
  try {
    const feedback = await coachAnswer(question, answer, technique ?? "chain_of_thought", !!selfCritique, g);
    return NextResponse.json({ ok: true, feedback });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
