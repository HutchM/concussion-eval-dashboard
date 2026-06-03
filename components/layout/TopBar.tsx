"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const nav = [
  { href: "/",         label: "Overview" },
  { href: "/enter",    label: "New Evaluation" },
  { href: "/athletes", label: "Users" },
];

export function TopBar() {
  const pathname = usePathname();
  return (
    <header className="md:hidden bg-slate-900 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="font-bold text-sm">ConcussionEval</span>
        </div>
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-2.5 py-1.5 rounded text-xs font-medium",
                  active ? "bg-indigo-600" : "text-slate-300"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
