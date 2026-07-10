const BLOCKED = [
  "ignore previous instructions",
  "ignore all previous",
  "disregard your instructions",
  "you are now",
  "system prompt",
  "reveal your prompt",
  "act as",
];

export function ruleGuard(input: string): { safe: boolean; reason: string } {
  if (!input || !input.trim()) return { safe: false, reason: "Input is empty." };
  if (input.length > 5000) return { safe: false, reason: "Input is too long (max 5000 characters)." };
  const low = input.toLowerCase();
  for (const p of BLOCKED) if (low.includes(p)) return { safe: false, reason: "Input blocked: possible prompt-injection attempt." };
  return { safe: true, reason: "" };
}
