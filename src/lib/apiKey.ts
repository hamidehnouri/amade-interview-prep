"use client";
import { useSyncExternalStore } from "react";

// The user's OpenRouter API key (BYOK). Kept in sessionStorage so it is cleared
// when the tab closes, and deliberately stored SEPARATELY from generation
// settings so it is never serialised into request bodies. It travels to the
// server only via the `x-openrouter-key` request header (over HTTPS).
const KEY = "amade.apiKey";
let state = "";
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { state = sessionStorage.getItem(KEY) ?? ""; } catch {}
}

function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function getSnapshot() { ensureLoaded(); return state; }
function getServerSnapshot() { return ""; }

// Read the current key imperatively (used when building request headers).
export function getApiKey(): string {
  ensureLoaded();
  return state;
}

export function setApiKey(key: string) {
  state = key.trim();
  try {
    if (state) sessionStorage.setItem(KEY, state);
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

export function useApiKey() {
  const apiKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { apiKey, setApiKey };
}
