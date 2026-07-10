"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Library, Mic, Settings, Bell } from "lucide-react";

const NAV = [
  { href: "/", label: "JD analyser", icon: Target },
  { href: "/question-bank", label: "Question bank", icon: Library },
  { href: "/mock-interview", label: "Mock interview", icon: Mic },
];
const TITLES: Record<string, string> = {
  "/": "JD analyser",
  "/question-bank": "Question bank",
  "/mock-interview": "Mock interview",
  "/settings": "Settings",
};

function NavItem({ href, label, icon: Icon, active }: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 font-display text-[15px] transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "font-medium text-secondary hover:bg-line-subtle hover:text-ink"
      }`}
    >
      {active && <span className="absolute left-0 top-[7px] bottom-[7px] w-[3px] rounded-r bg-accent" />}
      <Icon size={18} className={active ? "text-accent" : "text-muted"} />
      {label}
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full">
      <aside className="flex w-[236px] flex-shrink-0 flex-col border-r border-line bg-paper p-3 pt-4">
        <div className="flex items-center gap-2 px-2 pb-2">
          <svg viewBox="0 0 48 48" className="h-[22px] w-[22px]" role="img" aria-label="Āmāde">
            <rect x="14" y="7" width="20" height="5" rx="2.5" fill="#FF7A5C" />
            <path d="M10 40 L24 20 L38 40" fill="none" stroke="#4C6EF5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-[20px] font-bold tracking-tight">Āmāde</span>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavItem key={n.href} {...n} active={pathname === n.href} />
          ))}
        </nav>
        <div className="my-2 border-t border-line-subtle" />
        <NavItem href="/settings" label="Settings" icon={Settings} active={pathname === "/settings"} />
        <div className="flex-1" />
        <div className="flex items-center gap-2.5 border-t border-line-subtle px-2 py-2.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-blue-100 font-display text-[13px] font-semibold text-blue-700">
            HN
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[13px] font-semibold">Hamideh Nouri</div>
            <div className="text-[11px] text-muted">AI Engineer</div>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-7 py-4">
          <h1 className="font-display text-[24px] font-bold tracking-tight">{TITLES[pathname] ?? "Āmāde"}</h1>
          <button className="rounded-lg border border-line p-2 text-muted hover:bg-line-subtle" aria-label="Notifications">
            <Bell size={18} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
}
