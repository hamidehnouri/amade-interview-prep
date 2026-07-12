const TONE = {
  blue: "border border-blue-200 bg-blue-50 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  neutral: "bg-line-subtle text-secondary",
};
export default function Tag({ children, tone = "blue" }: { children: React.ReactNode; tone?: keyof typeof TONE }) {
  return <span className={`rounded-[8px] px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em] ${TONE[tone]}`}>{children}</span>;
}
