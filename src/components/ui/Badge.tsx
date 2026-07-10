export default function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  const styles = tone === "accent" ? "text-accent border-accent/35" : "text-secondary bg-line-subtle border-line";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] ${styles}`}>
      {children}
    </span>
  );
}
