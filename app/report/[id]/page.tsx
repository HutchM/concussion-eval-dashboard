"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEvaluationStore } from "@/store/evaluationStore";
import { AthleteProfile } from "@/components/report/AthleteProfile";
import { SymptomSection } from "@/components/report/SymptomSection";
import { VOMSSection } from "@/components/report/VOMSSection";
import { ExertionalSection } from "@/components/report/ExertionalSection";
import { ClinicalSummary } from "@/components/report/ClinicalSummary";
import { PatientSummary } from "@/components/report/PatientSummary";
import { clsx } from "clsx";

type View = "practitioner" | "patient";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { getEvaluation, getAthleteEvaluations } = useEvaluationStore();
  const [view, setView] = useState<View>("practitioner");

  const evaluation = getEvaluation(params.id as string);

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-900">Evaluation not found</h2>
        <button onClick={() => router.push("/")} className="text-indigo-600 underline text-sm">Back to overview</button>
      </div>
    );
  }

  const athleteEvals = getAthleteEvaluations(evaluation.athlete.id);
  const evalIndex = athleteEvals.findIndex((e) => e.id === evaluation.id);
  const evalLabel = evalIndex === 0 ? "Baseline" : `Follow-up ${evalIndex}`;
  const totalEvals = athleteEvals.length;

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">← Back</button>
            <span className="text-xs text-gray-300">·</span>
            <button onClick={() => router.push(`/athletes/${evaluation.athlete.id}`)} className="text-xs text-indigo-500 hover:text-indigo-700">
              All evaluations for {evaluation.athlete.name} ({totalEvals})
            </button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Evaluation Report</h1>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{evalLabel}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(evaluation.completedAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}Day {evaluation.athlete.daysSinceInjury} post-injury
          </p>
        </div>

        {/* View toggle + print */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("practitioner")}
              className={clsx("px-3 py-1.5 text-sm font-medium transition-colors", view === "practitioner" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50")}
            >
              Clinician View
            </button>
            <button
              onClick={() => setView("patient")}
              className={clsx("px-3 py-1.5 text-sm font-medium transition-colors", view === "patient" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50")}
            >
              Patient View
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Athlete profile — shown in both views */}
      <AthleteProfile athlete={evaluation.athlete} />

      {/* Practitioner view */}
      {view === "practitioner" && (
        <>
          <ClinicalSummary evaluation={evaluation} />
          <SymptomSection symptoms={evaluation.symptoms} />
          <VOMSSection voms={evaluation.voms} />
          <ExertionalSection exertional={evaluation.exertional} />
        </>
      )}

      {/* Patient / athlete view */}
      {view === "patient" && (
        <PatientSummary evaluation={evaluation} />
      )}

      {/* Evaluation navigation — other evals for this athlete */}
      {totalEvals > 1 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Other evaluations for {evaluation.athlete.name}</p>
          <div className="flex flex-wrap gap-2">
            {athleteEvals.map((e, i) => (
              <button
                key={e.id}
                onClick={() => router.push(`/report/${e.id}`)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  e.id === evaluation.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                {i === 0 ? "Baseline" : `Follow-up ${i}`}
                <span className="ml-1.5 text-xs opacity-70">
                  Day {e.athlete.daysSinceInjury}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
