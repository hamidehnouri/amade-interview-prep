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

const UNSAFE_OUTPUT = ["kill yourself", "how to make a bomb", "self-harm instructions"];

export function moderateOutput(text: string): { safe: boolean; reason: string } {
  const low = text.toLowerCase();
  for (const p of UNSAFE_OUTPUT) if (low.includes(p)) return { safe: false, reason: "Response withheld — flagged by output moderation." };
  return { safe: true, reason: "" };
}
