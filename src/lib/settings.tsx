"use client";
import { useSyncExternalStore } from "react";

export type GenerationSettings = {
  model: string;
  technique: string;
  temperature: number;
  maxTokens: number;
  reasoning: "minimal" | "low" | "medium" | "high";
  selfCritique: boolean;
};
export const DEFAULT_SETTINGS: GenerationSettings = {
  model: "openai/gpt-5-mini", technique: "chain_of_thought", temperature: 0.4,
  maxTokens: 1024, reasoning: "medium", selfCritique: false,
};
const KEY = "amade.settings";
let state: GenerationSettings = DEFAULT_SETTINGS;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = sessionStorage.getItem(KEY); if (raw) state = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }; } catch {}
}
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function getSnapshot() { ensureLoaded(); return state; }
function getServerSnapshot() { return DEFAULT_SETTINGS; }

export function updateSettings(patch: Partial<GenerationSettings>) {
  state = { ...state, ...patch };
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}
export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { settings, update: updateSettings };
}
