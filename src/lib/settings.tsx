"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type GenerationSettings = {
  model: string;
  technique: string;
  temperature: number;
  maxTokens: number;
  reasoning: "minimal" | "low" | "medium" | "high";
  stream: boolean;
  selfCritique: boolean;
};
export const DEFAULT_SETTINGS: GenerationSettings = {
  model: "openai/gpt-5-mini", technique: "chain_of_thought", temperature: 0.4,
  maxTokens: 1024, reasoning: "medium", stream: true, selfCritique: true,
};
type Ctx = { settings: GenerationSettings; update: (patch: Partial<GenerationSettings>) => void };
const SettingsContext = createContext<Ctx | null>(null);
const KEY = "amade.settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    try { const raw = sessionStorage.getItem(KEY); if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) }); } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);
  const update = (patch: Partial<GenerationSettings>) => setSettings((s) => ({ ...s, ...patch }));
  return <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>;
}
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
