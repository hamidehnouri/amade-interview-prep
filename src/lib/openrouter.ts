const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export type LlmOpts = { model: string; temperature?: number; maxTokens?: number; reasoningEffort?: string | null; apiKey?: string };

export async function askLlm(system: string, user: string, opts: LlmOpts): Promise<string> {
  const key = opts.apiKey || process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("No API key set — add your OpenRouter API key in Settings.");

  const body: Record<string, unknown> = {
    model: opts.model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  // Reasoning models ignore temperature; "off" (or unset) means use temperature instead.
  if (opts.reasoningEffort) body.reasoning = { effort: opts.reasoningEffort };
  else if (opts.temperature != null) body.temperature = opts.temperature;
  // GPT-5 always reasons (even without an explicit effort), so always leave headroom.
  const cap = Math.max(opts.maxTokens ?? 0, 2048);
  if (cap) body.max_tokens = cap;
  body.response_format = { type: "json_object" };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify((await res.json()).error ?? {}); } catch {}
    throw new Error(`OpenRouter request failed (HTTP ${res.status})${detail && detail !== "{}" ? ": " + detail : ""}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(`OpenRouter error: ${JSON.stringify(data.error)}`);
  const choice = data.choices?.[0];
  if (choice?.finish_reason === "length") throw new Error("The model's reply was cut off — increase Max output tokens in Settings.");
  const content = choice?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error("The model returned an empty response — try again, lower reasoning, or raise Max output tokens.");
  return content;
}
