export type ModelInfo = { value: string; label: string; inp: number; out: number; reasoning: boolean };

// inp/out = USD per 1M tokens — FALLBACK only. Live prices are fetched from /api/models.
export const MODELS: ModelInfo[] = [
  { value: "openai/gpt-5-mini", label: "GPT-5 mini · balanced", inp: 0.25, out: 2.0, reasoning: true },
  { value: "openai/gpt-5-nano", label: "GPT-5 nano · cheapest", inp: 0.05, out: 0.4, reasoning: true },
  { value: "openai/gpt-5", label: "GPT-5 · highest quality", inp: 1.25, out: 10.0, reasoning: true },
  { value: "google/gemma-4-31b-it", label: "Gemma 4 31B · open source", inp: 0.12, out: 0.35, reasoning: false },
];

export const getModel = (value: string) => MODELS.find((m) => m.value === value) ?? MODELS[0];
export const isReasoningModel = (value: string) => getModel(value).reasoning;
