"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useSettings, DEFAULT_SETTINGS, type GenerationSettings } from "@/lib/settings";
import { MODELS } from "@/lib/models";
import { useDevUnlocked, tryUnlock } from "@/lib/devAccess";

const REASONING = ["minimal", "low", "medium", "high"] as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const unlocked = useDevUnlocked();
  const [mode, setMode] = useState<"user" | "developer">("user");
  const [draft, setDraft] = useState<GenerationSettings>(settings);
  const set = (patch: Partial<GenerationSettings>) => setDraft((d) => ({ ...d, ...patch }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [saved, setSaved] = useState(false);

  const dev = mode === "developer";
  const m = MODELS.find((x) => x.value === draft.model)!;
  const isReasoning = m.reasoning;
  const cost = ((1200 * m.inp + draft.maxTokens * m.out) / 1e6) * 8;
  const reasoningIdx = Math.max(0, REASONING.indexOf(draft.reasoning));

  function chooseDeveloper() {
    if (unlocked) setMode("developer");
    else { setPw(""); setPwErr(""); setPwOpen(true); }
  }
  function submitPw() {
    if (tryUnlock(pw)) { setPwOpen(false); setMode("developer"); }
    else setPwErr("Incorrect password.");
  }
  function save() { update(draft); setSaved(true); setTimeout(() => setSaved(false), 2500); }

  const tabCls = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${active ? "bg-white text-ink shadow-sm" : "text-secondary"}`;

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-6">
      <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-secondary transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[24px] font-bold tracking-tight text-ink">Settings</h1>
          <p className="text-[13px] text-secondary">{dev ? "Advanced model & prompt configuration." : "Personalise your interview practice."}</p>
        </div>
        <div className="inline-flex shrink-0 rounded-full border border-line bg-line-subtle p-1 text-[13px] font-semibold">
          <button type="button" className={tabCls(!dev)} onClick={() => setMode("user")}>User</button>
          <button type="button" className={tabCls(dev)} onClick={chooseDeveloper}><Lock size={12} /> Developer</button>
        </div>
      </div>

      <Card rail={dev}>
        <Eyebrow badge={dev ? "Standard" : undefined}>Model</Eyebrow>
        <div className="grid grid-cols-[1fr_auto] gap-6">
          <Select label="Interview engine" value={draft.model} options={MODELS.map(({ value, label }) => ({ value, label }))} onChange={(v) => set({ model: v })} />
          <div className="min-w-[190px] rounded-[8px] bg-line-subtle p-3 font-mono text-[12px] text-secondary">
            <div className="flex justify-between"><span>Input</span><span>${m.inp.toFixed(2)} / 1M</span></div>
            <div className="mt-1 flex justify-between"><span>Output</span><span>${m.out.toFixed(2)} / 1M</span></div>
          </div>
        </div>
        {dev && (
          <>
            <hr className="my-[18px] border-line" />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-[14px] font-semibold text-ink">Estimated cost per session</div>
                <div className="text-[12px] text-muted">~8 questions · {draft.maxTokens.toLocaleString()} max output tokens each</div>
              </div>
              <div className="font-mono text-[24px] font-bold tracking-[-0.01em] text-ink">${cost.toFixed(2)}</div>
            </div>
          </>
        )}
      </Card>

      <Card rail={dev}>
        <Eyebrow>Generation</Eyebrow>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Slider label="Temperature" value={draft.temperature} min={0} max={1} step={0.1} format={(v) => v.toFixed(1)} disabled={isReasoning} onChange={(v) => set({ temperature: v })} hint={isReasoning ? "Ignored by reasoning models." : "Sampling randomness."} />
          <Slider label="Max output tokens" value={draft.maxTokens} min={256} max={4096} step={128} onChange={(v) => set({ maxTokens: v })} format={(v) => v.toLocaleString()} hint="Longer = more detailed feedback." />
          {dev && (
            <>
              <Slider label="Reasoning effort" value={reasoningIdx} min={0} max={3} step={1} disabled={!isReasoning} onChange={(i) => set({ reasoning: REASONING[i] })} format={(v) => cap(REASONING[v])} ticks={["Minimal", "Low", "Medium", "High"]} hint={isReasoning ? "Higher = slower & pricier." : "Not used by this model."} />
              <div className="flex flex-col justify-center">
                <Toggle checked={draft.selfCritique} onChange={(v) => set({ selfCritique: v })} label="Self-critique pass" hint="Model reviews its own scoring before returning." />
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setDraft(DEFAULT_SETTINGS)} className="rounded-[10px] border border-line px-5 py-2.5 font-display text-[14px] font-semibold text-secondary transition-colors hover:bg-line-subtle">
          Reset to defaults
        </button>
        <Button onClick={save} disabled={!dirty}>Save changes</Button>
      </div>

      {saved && (
        <div className="fixed bottom-5 right-5 z-50 rounded-[10px] bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lg">Settings saved</div>
      )}

      {pwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setPwOpen(false)}>
          <div className="w-full max-w-[380px] rounded-[12px] border border-line bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[17px] font-bold text-ink">Developer access</h2>
              <button type="button" onClick={() => setPwOpen(false)} className="text-muted hover:text-ink"><X size={18} /></button>
            </div>
            <p className="mt-1 text-[13px] text-secondary">Enter the developer password to unlock advanced settings.</p>
            <label className="mt-4 block text-[13px] font-medium text-ink">Password</label>
            <input type="password" value={pw} autoFocus onChange={(e) => { setPw(e.target.value); setPwErr(""); }} onKeyDown={(e) => e.key === "Enter" && submitPw()}
              className="mt-1 w-full rounded-[8px] border border-line bg-white px-3 py-2 text-[14px] text-ink outline-none focus:border-accent" />
            {pwErr && <p className="mt-1 text-[12px] text-red-600">{pwErr}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setPwOpen(false)} className="rounded-[10px] border border-line px-4 py-2 text-[14px] font-semibold text-secondary hover:bg-line-subtle">Cancel</button>
              <Button onClick={submitPw}>Unlock</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
