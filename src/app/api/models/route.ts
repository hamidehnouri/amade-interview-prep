import { NextResponse } from "next/server";

const API_BASE = "https://openrouter.ai/api/v1";

// Fetches the gateway's model catalogue and returns per-1M-token pricing keyed by model id.
// OpenRouter reports pricing.prompt / pricing.completion as USD per token (strings).
export async function GET(req: Request) {
  const key = req.headers.get("x-openrouter-key") || process.env.OPENROUTER_API_KEY;
  try {
    const res = await fetch(`${API_BASE}/models`, {
      headers: key ? { Authorization: `Bearer ${key}` } : {},
      next: { revalidate: 3600 }, // cache 1h
    });
    if (!res.ok) return NextResponse.json({ ok: false, pricing: {} });
    const data = await res.json();
    const list: any[] = data.data ?? data.models ?? [];
    const pricing: Record<string, { inp: number; out: number }> = {};
    for (const m of list) {
      const id: string | undefined = m.id ?? m.slug;
      const p = m.pricing ?? {};
      const inp = parseFloat(p.prompt ?? p.input ?? "0") * 1e6;
      const out = parseFloat(p.completion ?? p.output ?? "0") * 1e6;
      if (id && (inp > 0 || out > 0)) pricing[id] = { inp, out };
    }
    return NextResponse.json({ ok: true, pricing });
  } catch {
    return NextResponse.json({ ok: false, pricing: {} });
  }
}
