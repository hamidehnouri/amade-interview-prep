"use client";
import { useSyncExternalStore } from "react";
import type { Analysis, Question, Feedback } from "./api";

export type Step = "analyse" | "questions" | "practice" | "score";
export type WizardState = {
  step: Step;
  jd: string;
  analysis: Analysis | null;
  questions: Question[];
  selected: number;
  answer: string;
  feedback: Feedback | null;
  results: Record<number, Feedback>;
};
const DEFAULT: WizardState = { step: "analyse", jd: "", analysis: null, questions: [], selected: 0, answer: "", feedback: null, results: {} };
const KEY = "amade.wizard";

let state: WizardState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = sessionStorage.getItem(KEY); if (raw) state = { ...DEFAULT, ...JSON.parse(raw) }; } catch {}
}
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function getSnapshot() { ensureLoaded(); return state; }
function getServerSnapshot() { return DEFAULT; }

export function setWizard(patch: Partial<WizardState>) {
  state = { ...state, ...patch };
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}
export function useWizard() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
