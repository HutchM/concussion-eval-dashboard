import type { ExertionalResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { toleranceBadge } from "@/components/ui/Badge";
import { ExertionalChart } from "@/components/charts/ExertionalChart";
import { clsx } from "clsx";

interface Props { exertional: ExertionalResults; }

const STAGE_COLORS = [
  "bg-blue-50 border-blue-200",
  "bg-violet-50 border-violet-200",
  "bg-amber-50 border-amber-200",
  "bg-emerald-50 border-emerald-200",
];

const STAGE_HEADING = [
  "text-blue-700",
  "text-violet-700",
  "text-amber-700",
  "text-emerald-700",
];

function symptomStyle(score: number) {
  if (score >= 4) return "text-red-600 font-bold";
  if (score >= 1) return "text-amber-600 font-medium";
  return "text-gray-500";
}

export function ExertionalSection({ exertional }: Props) {
  const totalTaskCount = exertional.stages.reduce((sum, s) => sum + (s.tasks.length > 0 ? s.tasks.length : 1), 0);

  return (
    <Card className="mb-6" padding={false}>
      <div className="p-6 pb-2">
        <CardHeader
          title="Multimodal Exertional Testing"
          subtitle="Heart rate and symptom response across all stages and tasks."
          action={
            <div className="flex items-center gap-4">
              {toleranceBadge(exertional.exertionalTolerance)}
              <div className="text-right">
                <p className="text-xs text-gray-400">Stages Completed</p>
                <p className="text-xl font-bold text-gray-800">{exertional.stages.length}<span className="text-sm font-normal text-gray-400">/4</span></p>
              </div>
              {exertional.maxHeartRate && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Max HR</p>
                  <p className="text-xl font-bold text-gray-800">{exertional.maxHeartRate}<span className="text-sm font-normal text-gray-400"> bpm</span></p>
                </div>
              )}
            </div>
          }
        />
      </div>

      <div className="px-2 pb-2">
        <ExertionalChart exertional={exertional} />
      </div>

      {/* Per-stage breakdown */}
      <div className="px-6 pb-6 space-y-4">
        {exertional.stages.map((stage, si) => (
          <div key={stage.stageId} className={clsx("rounded-xl border overflow-hidden", STAGE_COLORS[si] ?? "bg-gray-50 border-gray-200")}>
            <div className="px-4 py-2.5 border-b border-inherit">
              <h4 className={clsx("text-sm font-bold", STAGE_HEADING[si] ?? "text-gray-700")}>
                Stage {stage.stageId} — {stage.stageName}
              </h4>
            </div>

            {stage.tasks.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-inherit">
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Task</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">HR (bpm)</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">RPE</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Symptoms</th>
                    <th className="text-left px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {stage.tasks.map((task) => (
                    <tr key={task.task} className="border-t border-inherit last:border-0">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{task.task}</td>
                      <td className="text-center px-3 py-2.5 font-medium text-indigo-700">{task.heartRate}</td>
                      <td className="text-center px-3 py-2.5 text-gray-600">{task.rpe}</td>
                      <td className={clsx("text-center px-3 py-2.5", symptomStyle(task.symptomScore))}>
                        {task.symptomScore}/10
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400">{task.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">HR</p>
                  <p className="font-medium text-indigo-700">{stage.heartRate ?? "—"} bpm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">RPE</p>
                  <p className="font-medium text-gray-700">{stage.rpe ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Symptoms</p>
                  <p className={clsx("font-medium", symptomStyle(stage.symptomScore ?? 0))}>
                    {stage.symptomScore ?? "—"}/10
                  </p>
                </div>
                {stage.notes && <p className="col-span-3 text-xs text-gray-400 italic">{stage.notes}</p>}
              </div>
            )}
          </div>
        ))}

        {/* Summary row */}
        <div className="flex flex-wrap gap-4 text-sm pt-1">
          <div><span className="text-gray-400">Resting HR:</span> <span className="font-medium">{exertional.restingHeartRate} bpm</span></div>
          {exertional.symptomThresholdInfo && (
            <div><span className="text-gray-400">First symptoms at:</span> <span className="font-medium text-amber-600">{exertional.symptomThresholdInfo}</span></div>
          )}
          <div><span className="text-gray-400">Stop reason:</span> <span className="font-medium">{exertional.stopReason}</span></div>
        </div>

        {exertional.notes && <p className="text-sm text-gray-500 italic">{exertional.notes}</p>}
      </div>
    </Card>
  );
}
