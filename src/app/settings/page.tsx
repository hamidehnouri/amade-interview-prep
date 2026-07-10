"use client";
import Card from "@/components/ui/Card";
import Kicker from "@/components/ui/Kicker";
import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";
import { useSettings } from "@/lib/settings";

const MODELS = [
  { value: "openai/gpt-5-mini", label: "GPT-5 mini · balanced", inp: 0.25, out: 2.0 },
  { value: "openai/gpt-5-nano", label: "GPT-5 nano · cheapest", inp: 0.05, out: 0.4 },
  { value: "openai/gpt-5", label: "GPT-5 · highest quality", inp: 1.25, out: 10.0 },
];
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
  const m = MODELS.find((x) => x.value === settings.model)!;
  const cost = ((1200 * m.inp + settings.maxTokens * m.out) / 1e6) * 8;
  const reasoningIdx = Math.max(0, REASONING.indexOf(settings.reasoning));

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <p className="max-w-[560px] text-[14px] text-secondary">
        Tune how the AI interviewer generates questions and scores answers. These settings apply to every new session.
      </p>

      <Card>
        <Kicker label="Model" badge="Standard" />
        <div className="grid grid-cols-[1fr_auto] gap-6">
          <div className="flex flex-col gap-4">
            <Select label="Interview engine" value={settings.model} options={MODELS.map(({ value, label }) => ({ value, label }))} onChange={(v) => update({ model: v })} />
            <Select label="Prompting technique" value={settings.technique} options={TECHNIQUES} onChange={(v) => update({ technique: v })} />
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
            <div className="text-[12px] text-muted">~8 questions · {settings.maxTokens.toLocaleString()} max output tokens each</div>
          </div>
          <div className="font-mono text-[24px] font-bold tracking-[-0.01em] text-ink">${cost.toFixed(2)}</div>
        </div>
      </Card>

      <Card>
        <Kicker label="Generation" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Slider label="Temperature" value={settings.temperature} min={0} max={1} step={0.1} format={(v) => v.toFixed(1)} disabled hint="Ignored when reasoning is on." />
          <Slider label="Reasoning effort" value={reasoningIdx} min={0} max={3} step={1} onChange={(i) => update({ reasoning: REASONING[i] })} format={(v) => cap(REASONING[v])} ticks={["Minimal", "Low", "Medium", "High"]} hint="Higher = more step-by-step thinking, slower & pricier." />
          <Slider label="Max output tokens" value={settings.maxTokens} min={256} max={4096} step={128} onChange={(v) => update({ maxTokens: v })} format={(v) => v.toLocaleString()} hint="Longer = more detailed feedback." />
          <div className="flex flex-col gap-4">
            <Toggle checked={settings.stream} onChange={(v) => update({ stream: v })} label="Stream responses" hint="Fetch the reply as a stream." />
            <Toggle checked={settings.selfCritique} onChange={(v) => update({ selfCritique: v })} label="Self-critique pass" hint="Model reviews its own scoring before returning." />
          </div>
        </div>
      </Card>
    </div>
  );
}
