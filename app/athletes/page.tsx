"use client";
import { useEvaluationStore } from "@/store/evaluationStore";
import { Card, CardHeader } from "@/components/ui/Card";
import { severityBadge, flagBadge, toleranceBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default function AthletesPage() {
  const { evaluations } = useEvaluationStore();

  // Group by athlete id — show latest eval per athlete
  const byAthlete = new Map<string, typeof evaluations[0]>();
  for (const e of evaluations) {
    const existing = byAthlete.get(e.athlete.id);
    if (!existing || new Date(e.completedAt) > new Date(existing.completedAt)) {
      byAthlete.set(e.athlete.id, e);
    }
  }
  const athletes = Array.from(byAthlete.values());

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Athletes</h1>
          <p className="text-sm text-gray-500 mt-1">Most recent evaluation per athlete</p>
        </div>
        <Link
          href="/enter"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Evaluation
        </Link>
      </div>

      {athletes.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-400">No athletes yet. <Link href="/enter" className="text-indigo-600 underline">Add an evaluation.</Link></p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {athletes.map((e) => {
            const flagCount = [
              e.symptoms.severityCategory === "Severe" || e.symptoms.severityCategory === "Moderate",
              e.voms.overallFlag !== "Pass",
              e.exertional.exertionalTolerance !== "Full",
            ].filter(Boolean).length;

            return (
              <Link key={e.athlete.id} href={`/report/${e.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg shrink-0">👤</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{e.athlete.name}</p>
                      <p className="text-xs text-gray-500">{e.athlete.sport}{e.athlete.position ? ` · ${e.athlete.position}` : ""}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Days post-injury</span>
                      <span className="font-semibold text-indigo-600">{e.athlete.daysSinceInjury}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Symptoms</span>
                      {severityBadge(e.symptoms.severityCategory)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">VOMS</span>
                      {flagBadge(e.voms.overallFlag)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Exertional</span>
                      {toleranceBadge(e.exertional.exertionalTolerance)}
                    </div>
                  </div>

                  {flagCount > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-red-600 font-medium">
                      🚩 {flagCount} domain{flagCount > 1 ? "s" : ""} flagged — review recommended
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
