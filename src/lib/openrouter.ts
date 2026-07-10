const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export type LlmOpts = { model: string; temperature?: number; maxTokens?: number; reasoningEffort?: string | null };

export async function askLlm(system: string, user: string, opts: LlmOpts): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("Missing OPENROUTER_API_KEY (set it in .env.local).");

  const body: Record<string, unknown> = {
    model: opts.model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  // Reasoning models ignore temperature; "off" (or unset) means use temperature instead.
  const usesReasoning = opts.reasoningEffort && opts.reasoningEffort !== "off";
  if (usesReasoning) body.reasoning = { effort: opts.reasoningEffort };
  else if (opts.temperature != null) body.temperature = opts.temperature;
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.choices) throw new Error(`OpenRouter error: ${JSON.stringify(data.error ?? data)}`);
  return data.choices[0].message.content as string;
}
