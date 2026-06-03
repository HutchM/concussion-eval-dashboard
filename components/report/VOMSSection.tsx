import type { VOMSResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { flagBadge } from "@/components/ui/Badge";
import { VOMSChart } from "@/components/charts/VOMSChart";
import { clsx } from "clsx";

interface Props { voms: VOMSResults; }

export function VOMSSection({ voms }: Props) {
  return (
    <Card className="mb-6" padding={false}>
      <div className="p-6 pb-2">
        <CardHeader
          title="Vestibular / Oculomotor Screening (VOMS)"
          subtitle="Baseline and post-test symptom ratings (0–10). Change ≥ 2 = clinically provoked."
          action={
            <div className="flex items-center gap-3">
              {flagBadge(voms.overallFlag)}
              <div className="text-right">
                <p className="text-xs text-gray-400">Tests Provoked</p>
                <p className="text-xl font-bold text-gray-800">{voms.provokedCount}<span className="text-sm font-normal text-gray-400">/7</span></p>
              </div>
            </div>
          }
        />
      </div>

      {/* Chart */}
      <div className="px-2 pb-2">
        <VOMSChart voms={voms} />
      </div>

      {/* Detail table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs text-gray-400 font-medium uppercase tracking-wide w-1/3">Test</th>
                <th className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Baseline</th>
                <th className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Post</th>
                <th className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Change</th>
                <th className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {voms.tests.map((t) => (
                <tr key={t.test} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-medium text-gray-800">
                    {t.test}
                    {t.npcDistance !== undefined && (
                      <span className="ml-2 text-xs text-gray-400">({t.npcDistance} cm)</span>
                    )}
                  </td>
                  <td className="text-center py-2.5 text-gray-600">{t.baselineSymptoms}</td>
                  <td className="text-center py-2.5 text-gray-600">{t.postSymptoms}</td>
                  <td className={clsx("text-center py-2.5 font-semibold", t.changeScore >= 2 ? "text-red-600" : "text-gray-600")}>
                    {t.changeScore >= 0 ? "+" : ""}{t.changeScore}
                  </td>
                  <td className="text-center py-2.5">
                    {t.provoked ? (
                      <span className="inline-flex items-center gap-1 text-red-600 font-medium text-xs">🚩 Provoked</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">✓ Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
