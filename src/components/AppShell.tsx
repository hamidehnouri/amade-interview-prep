"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/amade-logo.svg" alt="Āmāde" width={22} height={22} priority />
          <span className="font-display text-[20px] font-bold tracking-tight">Āmāde</span>
        </Link>
        <Link href="/settings" aria-label="Settings"
          className={`rounded-lg p-2 transition-colors ${pathname === "/settings" ? "text-accent" : "text-muted hover:text-ink"}`}>
          <Settings size={20} />
        </Link>
      </header>
      <main className="flex-1 overflow-y-auto p-7">{children}</main>
    </div>
  );
}
