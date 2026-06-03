import type { VOMSResults } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { flagBadge } from "@/components/ui/Badge";
import { VOMSChart } from "@/components/charts/VOMSChart";
import { clsx } from "clsx";

interface Props { voms: VOMSResults; }

const SYMPTOM_COLS = [
  { key: "headache"  as const, label: "Headache" },
  { key: "dizziness" as const, label: "Dizziness" },
  { key: "nausea"    as const, label: "Nausea" },
  { key: "fogginess" as const, label: "Fogginess" },
];

function changeStyle(change: number) {
  if (change >= 2) return "text-red-600 font-bold";
  if (change > 0)  return "text-amber-500 font-medium";
  return "text-gray-400";
}

export function VOMSSection({ voms }: Props) {
  return (
    <Card className="mb-6" padding={false}>
      <div className="p-6 pb-2">
        <CardHeader
          title="Vestibular / Oculomotor Screening (VOMS)"
          subtitle="Pre and post-test symptom scores (0–10) per symptom. Change ≥ 2 on any symptom = clinically provoked."
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

      {/* Chart — stacked change scores */}
      <div className="px-2 pb-2">
        <VOMSChart voms={voms} />
      </div>

      {/* Detail table */}
      <div className="px-6 pb-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-xs text-gray-400 font-medium uppercase tracking-wide w-36">Test</th>
              {SYMPTOM_COLS.map(({ label }) => (
                <th key={label} colSpan={3} className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide border-l border-gray-100 px-1">
                  {label}
                </th>
              ))}
              <th className="text-center py-2 text-xs text-gray-400 font-medium uppercase tracking-wide border-l border-gray-100 w-20">Status</th>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th></th>
              {SYMPTOM_COLS.map(({ label }) => (
                <>
                  <th key={`${label}-pre`}  className="text-center py-1 text-xs text-gray-400 font-normal border-l border-gray-100 w-10">Pre</th>
                  <th key={`${label}-post`} className="text-center py-1 text-xs text-gray-400 font-normal w-10">Post</th>
                  <th key={`${label}-chg`}  className="text-center py-1 text-xs text-gray-400 font-normal w-10">Δ</th>
                </>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {voms.tests.map((t) => (
              <tr key={t.test} className={clsx("border-b border-gray-50 last:border-0", t.provoked && "bg-red-50")}>
                <td className="py-2.5 font-medium text-gray-800 text-xs leading-tight pr-2">
                  {t.test}
                  {t.npcDistance !== undefined && (
                    <span className={clsx("block font-normal", t.npcDistance > 5 ? "text-red-500" : "text-gray-400")}>
                      {t.npcDistance} cm {t.npcDistance > 5 ? "↑" : "✓"}
                    </span>
                  )}
                </td>
                {SYMPTOM_COLS.map(({ key }) => {
                  const change = t.changeScores[key];
                  return (
                    <>
                      <td key={`${key}-pre`}  className="text-center py-2.5 text-gray-500 text-xs border-l border-gray-100">{t.pre[key]}</td>
                      <td key={`${key}-post`} className="text-center py-2.5 text-gray-500 text-xs">{t.post[key]}</td>
                      <td key={`${key}-chg`}  className={clsx("text-center py-2.5 text-xs", changeStyle(change))}>
                        {change >= 0 ? "+" : ""}{change}
                      </td>
                    </>
                  );
                })}
                <td className="text-center py-2.5 border-l border-gray-100">
                  {t.provoked ? (
                    <span className="text-xs font-semibold text-red-600">🚩 Provoked</span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">✓ Normal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
