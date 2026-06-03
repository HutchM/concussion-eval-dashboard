import type { SymptomResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { severityBadge } from "@/components/ui/Badge";
import { SymptomBarChart } from "@/components/charts/SymptomBarChart";

interface Props { symptoms: SymptomResults; }

export function SymptomSection({ symptoms }: Props) {
  return (
    <Card className="mb-6" padding={false}>
      <div className="p-6 pb-2">
        <CardHeader
          title="Symptom Checklist"
          subtitle="Self-reported symptom severity (0 = none, 6 = severe)"
          action={
            <div className="flex items-center gap-3">
              {severityBadge(symptoms.severityCategory)}
              {symptoms.percentageOfNormal !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Feels Normal</p>
                  <p className={`text-xl font-bold ${symptoms.percentageOfNormal >= 80 ? "text-emerald-600" : symptoms.percentageOfNormal >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {symptoms.percentageOfNormal}%
                  </p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Score</p>
                <p className="text-xl font-bold text-gray-800">{symptoms.totalSeverity}<span className="text-sm font-normal text-gray-400">/132</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Symptoms Reported</p>
                <p className="text-xl font-bold text-gray-800">{symptoms.totalCount}<span className="text-sm font-normal text-gray-400">/22</span></p>
              </div>
            </div>
          }
        />
      </div>
      <div className="px-2 pb-4">
        <SymptomBarChart symptoms={symptoms} />
      </div>
      {/* Color legend */}
      <div className="px-6 pb-4 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" /> None (0)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Mild (1–2)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" /> Moderate (3–4)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Severe (5–6)</span>
      </div>
    </Card>
  );
}
