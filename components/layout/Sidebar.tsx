"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const nav = [
  { href: "/",          label: "Overview",     icon: "⊞" },
  { href: "/enter",     label: "New Evaluation", icon: "＋" },
  { href: "/athletes",  label: "Athletes",     icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-56 bg-slate-900 text-white shrink-0 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🧠</span>
          <div>
            <p className="text-sm font-bold leading-tight">ConcussionEval</p>
            <p className="text-xs text-slate-400 leading-tight">Clinical Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Disclaimer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-[10px] text-slate-500 leading-relaxed">
          For clinical support only. Does not provide a medical diagnosis or replace individualized clinical judgment.
        </p>
      </div>
    </aside>
  );
}
