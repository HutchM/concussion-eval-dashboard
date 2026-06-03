import { clsx } from "clsx";
import type { ClinicalInsight } from "@/lib/insights";

const levelStyles = {
  info:    "bg-blue-50 border-blue-200 text-blue-800",
  caution: "bg-amber-50 border-amber-200 text-amber-800",
  flag:    "bg-red-50 border-red-200 text-red-800",
};

const levelIcons = {
  info:    "ℹ",
  caution: "⚠",
  flag:    "🚩",
};

export function InsightBox({ insight }: { insight: ClinicalInsight }) {
  return (
    <div className={clsx("flex gap-2.5 rounded-lg border px-4 py-3 text-sm", levelStyles[insight.level])}>
      <span className="shrink-0 mt-0.5">{levelIcons[insight.level]}</span>
      <div>
        <span className="font-semibold mr-1">{insight.domain}:</span>
        {insight.text}
      </div>
    </div>
  );
}
