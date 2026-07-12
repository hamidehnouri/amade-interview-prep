export default function Button({ children, onClick, disabled, loading, type = "button", className = "", variant = "primary" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean;
  type?: "button" | "submit"; className?: string; variant?: "primary" | "ghost";
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 font-display text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const styles = variant === "ghost"
    ? "border border-line text-secondary hover:bg-line-subtle"
    : "bg-accent text-white hover:bg-blue-700";
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${styles} ${className}`}>
      {loading ? "Working…" : children}
    </button>
  );
}
