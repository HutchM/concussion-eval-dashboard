import type { SymptomResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { severityBadge } from "@/components/ui/Badge";
import { SYMPTOM_CATEGORIES, categoryScore, categoryMax, CATEGORY_STYLES } from "@/lib/symptomCategories";
import { clsx } from "clsx";

interface Props { symptoms: SymptomResults; }

function ratingColor(v: number) {
  if (v === 0) return "bg-gray-100";
  if (v <= 2)  return "bg-amber-300";
  if (v <= 4)  return "bg-orange-400";
  return "bg-red-500";
}

function CategoryCard({ cat, scores }: { cat: typeof SYMPTOM_CATEGORIES[0]; scores: SymptomResults["scores"] }) {
  const style = CATEGORY_STYLES[cat.color];
  const total = categoryScore(cat, scores);
  const max = categoryMax(cat);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  const hasSymptoms = total > 0;

  return (
    <div className={clsx("rounded-xl border overflow-hidden", style.border)}>
      {/* Category header */}
      <div className={clsx("px-4 py-2.5 flex items-center justify-between", style.bg)}>
        <h4 className={clsx("text-sm font-semibold", style.heading)}>{cat.name}</h4>
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", style.badge)}>
            {total}/{max}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: CATEGORY_STYLES[cat.color].bar }}
        />
      </div>

      {/* Symptom rows */}
      <div className="divide-y divide-gray-50">
        {cat.symptoms.map((symptom) => {
          const v = scores[symptom] ?? 0;
          return (
            <div key={symptom} className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-gray-700 flex-1 min-w-0 pr-3">{symptom}</span>
              {/* Rating dots */}
              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span
                    key={n}
                    className={clsx(
                      "w-3 h-3 rounded-sm",
                      n <= v ? ratingColor(v) : "bg-gray-100"
                    )}
                  />
                ))}
                <span className={clsx(
                  "ml-2 text-xs font-semibold w-4 text-right",
                  v === 0 ? "text-gray-300" : v <= 2 ? "text-amber-600" : v <= 4 ? "text-orange-600" : "text-red-600"
                )}>
                  {v}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SymptomSection({ symptoms }: Props) {
  return (
    <Card className="mb-6" padding={false}>
      {/* Header */}
      <div className="p-6 pb-4">
        <CardHeader
          title="Symptom Checklist"
          subtitle="Self-reported severity (0 = none, 6 = severe) grouped by symptom domain"
          action={
            <div className="flex items-center gap-4">
              {severityBadge(symptoms.severityCategory)}
              {symptoms.percentageOfNormal !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Feels Normal</p>
                  <p className={clsx(
                    "text-xl font-bold",
                    symptoms.percentageOfNormal >= 80 ? "text-emerald-600" :
                    symptoms.percentageOfNormal >= 50 ? "text-amber-600" : "text-red-600"
                  )}>
                    {symptoms.percentageOfNormal}%
                  </p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Score</p>
                <p className="text-xl font-bold text-gray-800">
                  {symptoms.totalSeverity}<span className="text-sm font-normal text-gray-400">/132</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Symptoms</p>
                <p className="text-xl font-bold text-gray-800">
                  {symptoms.totalCount}<span className="text-sm font-normal text-gray-400">/22</span>
                </p>
              </div>
            </div>
          }
        />

        {/* Domain summary bar */}
        <div className="flex flex-wrap gap-2 mb-2">
          {SYMPTOM_CATEGORIES.filter((c) => c.name !== "Other").map((cat) => {
            const score = categoryScore(cat, symptoms.scores);
            const max = categoryMax(cat);
            const pct = max > 0 ? Math.round((score / max) * 100) : 0;
            const style = CATEGORY_STYLES[cat.color];
            return (
              <div key={cat.name} className="text-center min-w-[80px] flex-1">
                <p className="text-xs text-gray-500 font-medium truncate mb-1">{cat.name}</p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: style.bar }} />
                </div>
                <p className="text-xs text-gray-500">{score}/{max}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category cards */}
      <div className="px-6 pb-6 space-y-3">
        {SYMPTOM_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} scores={symptoms.scores} />
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 pb-4 flex items-center gap-4 text-xs text-gray-400 flex-wrap border-t border-gray-100 pt-3">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" /> 0 — None</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-300 inline-block" /> 1–2 — Mild</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> 3–4 — Moderate</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> 5–6 — Severe</span>
      </div>
    </Card>
  );
}
