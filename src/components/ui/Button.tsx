export default function Button({ children, onClick, disabled, loading, type = "button", className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; type?: "button" | "submit"; className?: string;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-2.5 font-display text-[14px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {loading ? "Working…" : children}
    </button>
  );
}
