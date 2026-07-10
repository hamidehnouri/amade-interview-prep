export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[8px] border border-line border-l-[3px] border-l-accent bg-white p-6 shadow-[0_1px_2px_rgba(35,41,70,0.06)] ${className}`}>
      {children}
    </div>
  );
}
