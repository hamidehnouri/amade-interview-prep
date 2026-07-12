export default function Callout({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[8px] border border-blue-200 bg-blue-50 p-4 ${className}`}>{children}</div>;
}
