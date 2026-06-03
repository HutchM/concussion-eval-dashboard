import { clsx } from "clsx";

type Variant = "green" | "yellow" | "red" | "blue" | "gray";

const variantClasses: Record<Variant, string> = {
  green:  "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  yellow: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red:    "bg-red-50 text-red-700 ring-red-600/20",
  blue:   "bg-blue-50 text-blue-700 ring-blue-600/20",
  gray:   "bg-gray-50 text-gray-600 ring-gray-500/10",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Convenience helpers
export function severityBadge(cat: string) {
  const map: Record<string, Variant> = { None: "green", Mild: "yellow", Moderate: "yellow", Severe: "red" };
  return <Badge variant={map[cat] ?? "gray"}>{cat}</Badge>;
}

export function flagBadge(flag: string) {
  const map: Record<string, Variant> = { Pass: "green", Caution: "yellow", Flag: "red" };
  return <Badge variant={map[flag] ?? "gray"}>{flag}</Badge>;
}

export function toleranceBadge(t: string) {
  const map: Record<string, Variant> = { Full: "green", "Symptom-limited": "yellow", "Unable to complete": "red" };
  return <Badge variant={map[t] ?? "gray"}>{t}</Badge>;
}
