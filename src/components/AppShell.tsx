"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-line bg-paper px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/amade-logo.svg" alt="Āmāde" width={22} height={22} priority />
          <span className="font-display text-[20px] font-bold tracking-tight">Āmāde</span>
        </Link>
        <div className="group relative">
          <Link href="/settings" aria-label="Advanced prompt settings"
            className={`flex rounded-lg p-2 transition-colors ${pathname === "/settings" ? "bg-blue-50 text-accent" : "text-muted hover:bg-line-subtle hover:text-ink"}`}>
            <Settings size={20} />
          </Link>
          <span className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Advanced prompt settings
          </span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-7">{children}</main>
    </div>
  );
}
