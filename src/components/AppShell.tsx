"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Target, Mic, Settings } from "lucide-react";
import NavItem from "@/components/ui/NavItem";

const NAV = [
  { href: "/", label: "JD analyser", icon: Target },
  { href: "/mock-interview", label: "Mock interview", icon: Mic },
];
const TITLES: Record<string, string> = {
  "/": "JD analyser",
  "/mock-interview": "Mock interview",
  "/settings": "Settings",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full">
      <aside className="flex w-[236px] flex-shrink-0 flex-col border-r border-line bg-paper p-3 pt-4">
        <div className="flex items-center gap-2 px-2 pb-2">
          <Image src="/amade-logo.svg" alt="Āmāde" width={22} height={22} priority />
          <span className="font-display text-[20px] font-bold tracking-tight">Āmāde</span>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavItem key={n.href} {...n} />
          ))}
        </nav>
        <div className="my-2 border-t border-line-subtle" />
        <NavItem href="/settings" label="Settings" icon={Settings} />
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
        <header className="flex items-center border-b border-line px-7 py-4">
          <h1 className="font-display text-[24px] font-bold tracking-tight">{TITLES[pathname] ?? "Āmāde"}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
}
