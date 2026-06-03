import type { ExertionalResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { toleranceBadge } from "@/components/ui/Badge";
import { ExertionalChart } from "@/components/charts/ExertionalChart";

interface Props { exertional: ExertionalResults; }

export function ExertionalSection({ exertional }: Props) {
  return (
    <Card className="mb-6" padding={false}>
      <div className="p-6 pb-2">
        <CardHeader
          title="Multimodal Exertional Testing"
          subtitle="Stage-by-stage heart rate and symptom response during graded exercise."
          action={
            <div className="flex items-center gap-4">
              {toleranceBadge(exertional.exertionalTolerance)}
              <div className="text-right">
                <p className="text-xs text-gray-400">Stages Completed</p>
                <p className="text-xl font-bold text-gray-800">{exertional.stages.length}</p>
              </div>
              {exertional.maxHeartRate && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Max HR</p>
                  <p className="text-xl font-bold text-gray-800">{exertional.maxHeartRate} <span className="text-sm font-normal text-gray-400">bpm</span></p>
                </div>
              )}
            </div>
          }
        />
      </div>

      <div className="px-2 pb-2">
        <ExertionalChart exertional={exertional} />
      </div>

      {/* Stage table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Stage", "Speed", "Incline", "Duration", "HR (bpm)", "RPE", "Symptoms"].map((h) => (
                  <th key={h} className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exertional.stages.map((s) => (
                <tr key={s.stage} className="border-b border-gray-50 last:border-0 text-center">
                  <td className="py-2 font-semibold text-gray-700">{s.stage}</td>
                  <td className="py-2 text-gray-600">{s.speed ? `${s.speed} km/h` : "—"}</td>
                  <td className="py-2 text-gray-600">{s.incline !== undefined ? `${s.incline}%` : "—"}</td>
                  <td className="py-2 text-gray-600">{s.duration ? `${s.duration} min` : "—"}</td>
                  <td className="py-2 font-medium text-indigo-700">{s.heartRate}</td>
                  <td className="py-2 text-gray-600">{s.rpe}</td>
                  <td className="py-2">
                    <span className={s.symptomScore >= 4 ? "text-red-600 font-semibold" : s.symptomScore >= 2 ? "text-amber-600 font-medium" : "text-gray-600"}>
                      {s.symptomScore}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-400">Resting HR:</span>{" "}
            <span className="font-medium">{exertional.restingHeartRate} bpm</span>
          </div>
          {exertional.symptomThresholdHR && (
            <div>
              <span className="text-gray-400">Symptom threshold HR:</span>{" "}
              <span className="font-medium text-amber-600">{exertional.symptomThresholdHR} bpm</span>
            </div>
          )}
          <div>
            <span className="text-gray-400">Stop reason:</span>{" "}
            <span className="font-medium">{exertional.stopReason}</span>
          </div>
        </div>

        {exertional.notes && (
          <p className="mt-3 text-sm text-gray-500 italic">{exertional.notes}</p>
        )}
      </div>
    </Card>
  );
}
