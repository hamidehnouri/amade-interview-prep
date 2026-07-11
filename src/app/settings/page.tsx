"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Kicker from "@/components/ui/Kicker";
import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useSettings, DEFAULT_SETTINGS, type GenerationSettings } from "@/lib/settings";
import { MODELS } from "@/lib/models";

const TECHNIQUES = [
  { value: "zero_shot", label: "Zero-shot" },
  { value: "chain_of_thought", label: "Chain-of-thought" },
  { value: "few_shot", label: "Few-shot" },
  { value: "persona", label: "Persona" },
  { value: "rubric", label: "Rubric" },
];
const REASONING = ["minimal", "low", "medium", "high"] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const [draft, setDraft] = useState<GenerationSettings>(settings);
  const set = (patch: Partial<GenerationSettings>) => setDraft((d) => ({ ...d, ...patch }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const m = MODELS.find((x) => x.value === draft.model)!;
  const isReasoning = m.reasoning;
  const cost = ((1200 * m.inp + draft.maxTokens * m.out) / 1e6) * 8;
  const reasoningIdx = Math.max(0, REASONING.indexOf(draft.reasoning));

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-secondary transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="font-display text-[24px] font-bold tracking-tight text-ink">Settings</h1>
      <p className="max-w-[560px] text-[14px] text-secondary">
        Tune how the AI interviewer generates questions and scores answers. These settings apply to every new session.
      </p>

      <Card rail>
        <Kicker label="Model" badge="Standard" />
        <div className="grid grid-cols-[1fr_auto] gap-6">
          <div className="flex flex-col gap-4">
            <Select label="Interview engine" value={draft.model} options={MODELS.map(({ value, label }) => ({ value, label }))} onChange={(v) => set({ model: v })} />
            <Select label="Prompting technique" value={draft.technique} options={TECHNIQUES} onChange={(v) => set({ technique: v })} />
          </div>
          <div className="min-w-[190px] rounded-[8px] bg-line-subtle p-3 font-mono text-[12px] text-secondary">
            <div className="flex justify-between"><span>Input</span><span>${m.inp.toFixed(2)} / 1M</span></div>
            <div className="mt-1 flex justify-between"><span>Output</span><span>${m.out.toFixed(2)} / 1M</span></div>
          </div>
        </div>
        <hr className="my-[18px] border-line" />
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-[14px] font-semibold text-ink">Estimated cost per session</div>
            <div className="text-[12px] text-muted">~8 questions · {draft.maxTokens.toLocaleString()} max output tokens each</div>
          </div>
          <div className="font-mono text-[24px] font-bold tracking-[-0.01em] text-ink">${cost.toFixed(2)}</div>
        </div>
      </Card>

      <Card rail>
        <Kicker label="Generation" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Slider label="Temperature" value={draft.temperature} min={0} max={1} step={0.1} format={(v) => v.toFixed(1)} disabled={isReasoning} onChange={(v) => set({ temperature: v })} hint={isReasoning ? "Ignored by reasoning models." : "Sampling randomness — higher is more varied."} />
          <Slider label="Reasoning effort" value={reasoningIdx} min={0} max={3} step={1} disabled={!isReasoning} onChange={(i) => set({ reasoning: REASONING[i] })} format={(v) => cap(REASONING[v])} ticks={["Minimal", "Low", "Medium", "High"]} hint={isReasoning ? "Higher = more step-by-step thinking, slower & pricier." : "Not used by this model."} />
          <Slider label="Max output tokens" value={draft.maxTokens} min={256} max={4096} step={128} onChange={(v) => set({ maxTokens: v })} format={(v) => v.toLocaleString()} hint="Longer = more detailed feedback." />
          <div className="flex flex-col gap-4">
            <Toggle checked={draft.selfCritique} onChange={(v) => set({ selfCritique: v })} label="Self-critique pass" hint="Model reviews its own scoring before returning." />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setDraft(DEFAULT_SETTINGS)}
          className="rounded-[10px] border border-line px-5 py-2.5 font-display text-[14px] font-semibold text-secondary transition-colors hover:bg-line-subtle">
          Reset to defaults
        </button>
        <Button onClick={() => update(draft)} disabled={!dirty}>Save changes</Button>
      </div>
    </div>
  );
}
