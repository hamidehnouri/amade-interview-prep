"use client";
import { useSyncExternalStore } from "react";
import type { Question } from "./api";

export type BankQuestion = Question & { practiced: boolean };
const KEY = "amade.bank";
const EMPTY: BankQuestion[] = [];
let state: BankQuestion[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = sessionStorage.getItem(KEY); if (raw) state = JSON.parse(raw); } catch {}
}
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function getSnapshot() { ensureLoaded(); return state; }
function getServerSnapshot() { return EMPTY; }
function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

export function addQuestions(qs: Question[]) {
  const seen = new Set(state.map((q) => q.question));
  const add = qs.filter((q) => !seen.has(q.question)).map((q) => ({ ...q, practiced: false }));
  if (add.length === 0) return;
  state = [...state, ...add];
  persist();
  listeners.forEach((l) => l());
}
export function markPracticed(question: string) {
  if (!state.some((q) => q.question === question && !q.practiced)) return;
  state = state.map((q) => (q.question === question ? { ...q, practiced: true } : q));
  persist();
  listeners.forEach((l) => l());
}
export function useBank() {
  const questions = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { questions, addQuestions, markPracticed };
}
