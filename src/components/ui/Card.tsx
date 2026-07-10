export default function Card({ children, className = "", rail = false }: { children: React.ReactNode; className?: string; rail?: boolean }) {
  return (
    <div className={`rounded-[8px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(35,41,70,0.06)] ${rail ? "border-l-[3px] border-l-accent" : ""} ${className}`}>
      {children}
    </div>
  );
}
