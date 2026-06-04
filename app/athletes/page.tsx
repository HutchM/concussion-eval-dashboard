"use client";
import { useEvaluationStore } from "@/store/evaluationStore";
import { severityBadge, flagBadge, toleranceBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { clsx } from "clsx";

export default function AthletesPage() {
  const { getUniqueAthletes, getAthleteEvaluations } = useEvaluationStore();
  const athletes = getUniqueAthletes();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""} — click a name to view their full history</p>
        </div>
        <Link href="/enter" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + New Evaluation
        </Link>
      </div>

      {athletes.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-400">No athletes yet. <Link href="/enter" className="text-indigo-600 underline">Add an evaluation.</Link></p>
        </Card>
      ) : (
        <div className="space-y-4">
          {athletes.map((athlete) => {
            const evals = getAthleteEvaluations(athlete.id);
            const latest = evals[evals.length - 1];
            const flagCount = evals.filter((e) =>
              e.symptoms.severityCategory === "Severe" ||
              e.voms.overallFlag === "Flag" ||
              e.exertional.exertionalTolerance === "Unable to complete"
            ).length;

            return (
              <Card key={athlete.id} padding={false}>
                {/* Athlete header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg shrink-0">👤</div>
                    <div>
                      <Link href={`/athletes/${athlete.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
                        {athlete.name}
                        <span className="text-gray-300 group-hover:text-indigo-400 text-xs transition-colors">↗</span>
                      </Link>
                      <p className="text-xs text-gray-500">{athlete.sport}{athlete.position ? ` · ${athlete.position}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {flagCount > 0 && (
                      <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                        🚩 {flagCount} flagged
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{evals.length} eval{evals.length !== 1 ? "s" : ""}</span>
                    <Link
                      href={`/athletes/${athlete.id}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      📈 History &amp; Trends
                    </Link>
                    <Link
                      href={`/enter?athleteId=${athlete.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Follow-up
                    </Link>
                  </div>
                </div>

                {/* Evaluation timeline */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["#", "Date", "Days P.I.", "Symptoms", "VOMS", "Exertional", ""].map((h) => (
                          <th key={h} className="px-4 py-2 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {evals.map((e, i) => (
                        <tr key={e.id} className={clsx("border-t border-gray-50 hover:bg-gray-50 transition-colors", i === evals.length - 1 && "font-medium")}>
                          <td className="px-4 py-2.5 text-gray-400 text-xs">
                            {i === 0 ? "Baseline" : `Follow-up ${i}`}
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">
                            {new Date(e.completedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">{e.athlete.daysSinceInjury}</td>
                          <td className="px-4 py-2.5">{severityBadge(e.symptoms.severityCategory)}</td>
                          <td className="px-4 py-2.5">{flagBadge(e.voms.overallFlag)}</td>
                          <td className="px-4 py-2.5">{toleranceBadge(e.exertional.exertionalTolerance)}</td>
                          <td className="px-4 py-2.5">
                            <Link href={`/report/${e.id}`} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">View →</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
