"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

const BARS = 5;

export default function Recorder({ onTranscript, disabled }: { onTranscript: (text: string) => void; disabled?: boolean }) {
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState("");
  const recogRef = useRef<any>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const meterRef = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number } | null>(null);

  const SR = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

  async function startMeter() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < BARS; i++) {
          const v = (data[i * 2 + 1] ?? 0) / 255;
          const el = barsRef.current[i];
          if (el) el.style.transform = `scaleY(${0.2 + v * 0.8})`;
        }
        if (meterRef.current) meterRef.current.raf = requestAnimationFrame(loop);
      };
      meterRef.current = { ctx, stream, raf: requestAnimationFrame(loop) };
    } catch {
      /* meter is optional */
    }
  }
  function stopMeter() {
    const m = meterRef.current;
    if (!m) return;
    cancelAnimationFrame(m.raf);
    m.stream.getTracks().forEach((t) => t.stop());
    m.ctx.close().catch(() => {});
    meterRef.current = null;
  }

  function toggle() {
    if (!SR) { setNote("Voice input needs Chrome or Edge."); return; }
    if (recording) { recogRef.current?.stop(); return; }
    setNote("");
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.continuous = true;
    let text = "";
    r.onresult = (ev: any) => { for (let i = ev.resultIndex; i < ev.results.length; i++) text += ev.results[i][0].transcript; };
    r.onerror = (ev: any) => { setNote(ev?.error === "not-allowed" ? "Microphone access denied." : "Voice input error."); setRecording(false); stopMeter(); };
    r.onend = () => { setRecording(false); stopMeter(); if (text.trim()) onTranscript(text.trim()); };
    recogRef.current = r;
    r.start();
    setRecording(true);
    startMeter();
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={disabled} onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 font-display text-[13px] font-semibold transition-colors disabled:opacity-50 ${recording ? "border-red-300 bg-red-50 text-red-600" : "border-line text-secondary hover:bg-line-subtle"}`}>
        {recording ? <Square size={15} /> : <Mic size={15} />}
        {recording ? "Stop" : "Record answer"}
      </button>
      {recording && (
        <span className="flex h-4 items-center gap-[2px]" aria-hidden>
          {Array.from({ length: BARS }).map((_, i) => (
            <span key={i} ref={(el) => { barsRef.current[i] = el; }}
              className="w-[3px] rounded-full bg-red-500 transition-transform duration-75"
              style={{ height: "100%", transform: "scaleY(0.2)", transformOrigin: "center" }} />
          ))}
        </span>
      )}
      {note && <span className="text-[12px] text-muted">{note}</span>}
    </div>
  );
}
