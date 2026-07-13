import { NextResponse } from "next/server";
import { z } from "zod";
import { coachAnswer } from "@/lib/features";
import { SettingsSchema } from "@/lib/schemas";
import { isReasoningModel } from "@/lib/models";

const EvalRequest = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  techniques: z.array(z.string()).min(1),
  systemPrompt: z.string().nullable().catch(null),
  settings: SettingsSchema,
});

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-openrouter-key") || undefined;
  if (!apiKey && !process.env.OPENROUTER_API_KEY) return NextResponse.json({ ok: false, error: "No API key set — add your OpenRouter API key in Settings." });
  const parsed = EvalRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request." });
  const { question, answer, techniques, systemPrompt, settings } = parsed.data;
  const g = {
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    reasoningEffort: isReasoningModel(settings.model) ? settings.reasoning : null,
    apiKey,
  };

  const results = await Promise.all(
    techniques.map(async (technique) => {
      try {
        const feedback = await coachAnswer(question, answer, technique, false, g, techniques.length === 1 ? systemPrompt : null);
        return { technique, feedback };
      } catch (e) {
        return { technique, error: e instanceof Error ? e.message : String(e) };
      }
    })
  );
  return NextResponse.json({ ok: true, results });
}
