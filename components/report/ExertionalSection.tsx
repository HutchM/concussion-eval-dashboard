import type { ExertionalResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { toleranceBadge } from "@/components/ui/Badge";
import { ExertionalChart } from "@/components/charts/ExertionalChart";
import { HRFileChart } from "@/components/charts/HRFileChart";
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
              {exertional.hrFileName && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">HR File</p>
                  <p className="text-sm font-medium text-emerald-600">✓ Uploaded</p>
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Symptom chart */}
      <div className="px-2 pb-2">
        <ExertionalChart exertional={exertional} />
      </div>

      {/* HR file chart — only shown when a file was uploaded */}
      {exertional.hrFileData && exertional.hrFileData.length > 0 && (
        <div className="px-6 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Heart Rate Trace</p>
          <HRFileChart data={exertional.hrFileData} fileName={exertional.hrFileName} />
        </div>
      )}

      {/* Per-stage breakdown */}
      <div className="px-6 pb-6 space-y-4">
        {exertional.stages.map((stage, si) => (
          <div key={stage.stageId} className={clsx("rounded-xl border overflow-hidden", STAGE_COLORS[si] ?? "bg-gray-50 border-gray-200")}>
            <div className="px-4 py-2.5 border-b border-inherit">
              <h4 className={clsx("text-sm font-bold", STAGE_HEADING[si] ?? "text-gray-700")}>
                Stage {stage.stageId} — {stage.stageName}
              </h4>
            </div>

            {/* Immediate Memory — Stage 1 */}
            {stage.immediateMemory && (
              <div className="px-4 pt-3 pb-1">
                <div className="rounded-lg bg-white border border-blue-100 p-4">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Immediate Memory — 3 Trials</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Score</p>
                      <p className={clsx("text-2xl font-bold",
                        stage.immediateMemory.totalScore >= 30 ? "text-emerald-600" :
                        stage.immediateMemory.totalScore >= 24 ? "text-amber-600" : "text-red-600"
                      )}>
                        {stage.immediateMemory.totalScore}
                        <span className="text-sm font-normal text-gray-400">/36</span>
                      </p>
                    </div>
                  </div>
                  {/* Word list */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-3">
                    {stage.immediateMemory.words.map((word, i) => (
                      <div key={word} className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                        <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}.</span>
                        <span className="text-xs font-medium text-gray-700">{word}</span>
                      </div>
                    ))}
                  </div>
                  {/* Trial scores */}
                  <div className="flex gap-6">
                    {[
                      { label: "Trial 1", score: stage.immediateMemory.trial1 },
                      { label: "Trial 2", score: stage.immediateMemory.trial2 },
                      { label: "Trial 3", score: stage.immediateMemory.trial3 },
                    ].map(({ label, score }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{score}<span className="text-sm font-normal text-gray-400">/12</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {stage.tasks.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-inherit">
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Task</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">RPE</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Symptoms</th>
                    <th className="text-left px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {stage.tasks.map((task) => (
                    <tr key={task.task} className="border-t border-inherit last:border-0">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{task.task}</td>
                      <td className="text-center px-3 py-2.5 text-gray-600">{task.rpe ?? "—"}</td>
                      <td className={clsx("text-center px-3 py-2.5", symptomStyle(task.symptomScore))}>
                        {task.symptomScore}/10
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400">{task.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-4 py-3 grid grid-cols-2 gap-4 text-sm">
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
