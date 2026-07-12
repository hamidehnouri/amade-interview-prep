export type Technique = { value: string; label: string; description: string; badge?: string };

export const TECHNIQUES: Technique[] = [
  { value: "zero_shot", label: "Zero-shot", description: "Ask directly, no examples. Fastest, lowest token use." },
  { value: "chain_of_thought", label: "Chain-of-thought", description: "Reason step-by-step before scoring. Best accuracy.", badge: "Recommended" },
  { value: "few_shot", label: "Few-shot", description: "Prime with 2–3 exemplar scored answers first." },
  { value: "persona", label: "Persona", description: "Adopt a senior hiring-manager persona." },
  { value: "rubric", label: "Rubric", description: "Score against an explicit anchored rubric." },
];
export const TECH_LABEL: Record<string, string> = Object.fromEntries(TECHNIQUES.map((t) => [t.value, t.label]));
