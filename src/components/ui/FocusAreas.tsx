"use client";
import { useEffect, useRef, useState } from "react";

const chipCls = "rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink whitespace-nowrap";

export default function FocusAreas({ skills }: { skills: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(skills.length);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      const chips = Array.from(el.querySelectorAll<HTMLElement>("[data-chip]"));
      if (!chips.length) return;
      const top = chips[0].offsetTop;
      let line = 0;
      for (const c of chips) { if (c.offsetTop > top + 2) break; line++; }
      // reserve one slot for the "+N more" button when some chips are hidden
      setVisible(line >= chips.length ? chips.length : Math.max(1, line - 1));
    };
    let raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [skills]);

  const shown = expanded ? skills : skills.slice(0, visible);
  const hidden = skills.length - visible;

  return (
    <div className="relative">
      {/* invisible measuring row: all chips at the real available width */}
      <div ref={measureRef} aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-2">
        {skills.map((s) => <span key={s} data-chip className={chipCls}>{s}</span>)}
      </div>
      {/* visible row */}
      <div className="flex flex-wrap items-center gap-2">
        {shown.map((s) => <span key={s} className={chipCls}>{s}</span>)}
        {!expanded && hidden > 0 && (
          <button type="button" onClick={() => setExpanded(true)} className="px-1 text-[13px] font-medium text-accent hover:underline">+{hidden} more</button>
        )}
        {expanded && skills.length > visible && (
          <button type="button" onClick={() => setExpanded(false)} className="px-1 text-[13px] font-medium text-accent hover:underline">Show less</button>
        )}
      </div>
    </div>
  );
}
