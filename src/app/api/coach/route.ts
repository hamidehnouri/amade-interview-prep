import { NextResponse } from "next/server";
import { ruleGuard, moderateOutput } from "@/lib/guard";
import { coachAnswer } from "@/lib/features";
import { CoachRequest } from "@/lib/schemas";
import { isReasoningModel } from "@/lib/models";

export async function POST(req: Request) {
  const parsed = CoachRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request." });
  const { question, answer, technique, selfCritique, settings } = parsed.data;

  if (settings.injectionGuard) {
    const guard = ruleGuard(answer);
    if (!guard.safe) return NextResponse.json({ ok: false, error: guard.reason });
  }

  const g = {
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    reasoningEffort: isReasoningModel(settings.model) ? settings.reasoning : null,
  };
  try {
    const feedback = await coachAnswer(question, answer, technique, selfCritique, g, settings.customPrompt);
    if (settings.outputModeration) {
      const text = [feedback.overall, feedback.situation.feedback, feedback.task.feedback, feedback.action.feedback, feedback.result.feedback].join(" ");
      const mod = moderateOutput(text);
      if (!mod.safe) return NextResponse.json({ ok: false, error: mod.reason });
    }
    return NextResponse.json({ ok: true, feedback });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) });
  }
}
