"use client";
import { useEvaluationStore } from "@/store/evaluationStore";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { severityBadge, flagBadge, toleranceBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default function OverviewPage() {
  const { evaluations } = useEvaluationStore();

  const flagged = evaluations.filter(
    (e) =>
      e.symptoms.severityCategory === "Severe" ||
      e.voms.overallFlag === "Flag" ||
      e.exertional.exertionalTolerance === "Unable to complete"
  );

  const avgSeverity =
    evaluations.length > 0
      ? Math.round(evaluations.reduce((s, e) => s + e.symptoms.totalSeverity, 0) / evaluations.length)
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Summary of all recorded concussion evaluations</p>
        </div>
        <Link
          href="/enter"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Evaluation
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Evaluations" value={evaluations.length} sub="all time" />
        <StatCard label="Athletes Tested" value={new Set(evaluations.map((e) => e.athlete.id)).size} sub="unique athletes" />
        <StatCard label="Avg. Symptom Score" value={avgSeverity} sub="out of 132" />
        <StatCard label="Flagged for Follow-up" value={flagged.length} sub="requiring attention" accent={flagged.length > 0 ? "red" : "green"} />
      </div>

      {flagged.length > 0 && (
        <Card className="mb-6">
          <CardHeader title="🚩 Athletes Flagged for Follow-up" subtitle="Evaluations with severe symptoms, significant VOMS findings, or poor exertional tolerance" />
          <div className="space-y-2">
            {flagged.map((e) => (
              <Link
                key={e.id}
                href={`/report/${e.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{e.athlete.name}</p>
                  <p className="text-xs text-gray-500">{e.athlete.sport} · {e.athlete.daysSinceInjury} days post-injury</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {severityBadge(e.symptoms.severityCategory)}
                  {flagBadge(e.voms.overallFlag)}
                  <span className="text-indigo-600 font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card padding={false}>
        <div className="p-6 pb-3">
          <CardHeader title="All Evaluations" subtitle={`${evaluations.length} evaluation${evaluations.length !== 1 ? "s" : ""} recorded`} />
        </div>
        {evaluations.length === 0 ? (
          <div className="px-6 pb-6 text-sm text-gray-400">
            No evaluations yet.{" "}
            <Link href="/enter" className="text-indigo-600 underline">Add one now.</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Athlete", "Sport", "Days P.I.", "Symptoms", "VOMS", "Exertional", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evaluations.map((e) => (
                  <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{e.athlete.name}</td>
                    <td className="px-4 py-3 text-gray-600">{e.athlete.sport}{e.athlete.position ? ` · ${e.athlete.position}` : ""}</td>
                    <td className="px-4 py-3 text-gray-600">{e.athlete.daysSinceInjury}</td>
                    <td className="px-4 py-3">{severityBadge(e.symptoms.severityCategory)}</td>
                    <td className="px-4 py-3">{flagBadge(e.voms.overallFlag)}</td>
                    <td className="px-4 py-3">{toleranceBadge(e.exertional.exertionalTolerance)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(e.completedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/report/${e.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
