import { clsx } from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "green" | "yellow" | "red";
  icon?: React.ReactNode;
}

const accentColors = {
  default: "text-indigo-600",
  green:   "text-emerald-600",
  yellow:  "text-amber-600",
  red:     "text-red-600",
};

export function StatCard({ label, value, sub, accent = "default", icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className={clsx("mt-2 text-3xl font-bold tracking-tight", accentColors[accent])}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
