import type { Feedback } from "./api";

export const STAR = ["situation", "task", "action", "result"] as const;
export type StarKey = (typeof STAR)[number];

export const overallScore = (fb: Feedback) =>
  Math.round((STAR.reduce((a, k) => a + fb[k].score, 0) / STAR.length) * 10);

export type Level = "green" | "blue" | "yellow" | "red";
export const levelOf = (score100: number): Level =>
  score100 >= 80 ? "green" : score100 >= 60 ? "blue" : score100 >= 40 ? "yellow" : "red";

export const LEVEL: Record<Level, { text: string; bg: string; bar: string; ring: string }> = {
  green: { text: "text-green-700", bg: "bg-green-100", bar: "bg-green-500", ring: "#16a34a" },
  blue: { text: "text-accent", bg: "bg-blue-50", bar: "bg-accent", ring: "#4C6EF5" },
  yellow: { text: "text-amber-700", bg: "bg-amber-100", bar: "bg-amber-400", ring: "#f59e0b" },
  red: { text: "text-red-700", bg: "bg-red-100", bar: "bg-red-500", ring: "#dc2626" },
};
