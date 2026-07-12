"use client";
import { useSyncExternalStore } from "react";

const KEY = "amade.dev";
const DEV_PASSWORD = "123"; // demo gate only — client-side, not real auth

let unlocked = false;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { unlocked = sessionStorage.getItem(KEY) === "1"; } catch {}
}
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
function getSnapshot() { ensureLoaded(); return unlocked; }
function getServerSnapshot() { return false; }

export function tryUnlock(pw: string) {
  if (pw !== DEV_PASSWORD) return false;
  unlocked = true;
  try { sessionStorage.setItem(KEY, "1"); } catch {}
  listeners.forEach((l) => l());
  return true;
}
export function useDevUnlocked() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
