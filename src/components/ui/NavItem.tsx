"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export default function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;
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
