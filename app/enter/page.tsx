"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { EntryFormValues } from "@/components/entry/types";
import { AthleteForm } from "@/components/entry/AthleteForm";
import { SymptomEntryForm } from "@/components/entry/SymptomEntryForm";
import { VOMSEntryForm } from "@/components/entry/VOMSEntryForm";
import { ExertionalEntryForm } from "@/components/entry/ExertionalEntryForm";
import { Card } from "@/components/ui/Card";
import { useEvaluationStore } from "@/store/evaluationStore";
import { calculateSymptomResults, calculateVOMSResults, calculateExertionalResults, calcDaysSinceInjury, buildVOMSTestResult } from "@/lib/scoring";
import { SYMPTOM_LIST, VOMS_TESTS } from "@/types";
import type { SymptomScores, VOMSTestResult, ExertionalStage } from "@/types";
import { clsx } from "clsx";

const STEPS = ["Profile", "Symptoms", "VOMS", "Exertional Testing", "Review & Save"];

// Build default symptom values (all 0)
function defaultSymptoms(): Record<string, number> {
  return Object.fromEntries(SYMPTOM_LIST.map((s) => [s, 0]));
}

const zeroSymptoms = () => ({ headache: 0, dizziness: 0, nausea: 0, fogginess: 0 });

// Build default VOMS values
function defaultVOMS() {
  return Object.fromEntries(VOMS_TESTS.map((t) => [t, { pre: zeroSymptoms(), post: zeroSymptoms() }]));
}

export default function EnterPage() {
  const router = useRouter();
  const { addEvaluation } = useEvaluationStore();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm<EntryFormValues>({
    defaultValues: {
      evaluationDate: today,
      symptoms: defaultSymptoms(),
      percentageOfNormal: "80",
      voms: defaultVOMS(),
      stopReason: "Protocol complete",
      stages: [
        { stage: 1, speed: "3.2", incline: "0", duration: "2", heartRate: "", rpe: "", symptomScore: "", notes: "" },
        { stage: 2, speed: "4.0", incline: "0", duration: "2", heartRate: "", rpe: "", symptomScore: "", notes: "" },
        { stage: 3, speed: "4.8", incline: "2", duration: "2", heartRate: "", rpe: "", symptomScore: "", notes: "" },
      ],
    },
  });

  const onSubmit = (data: EntryFormValues) => {
    // Build typed objects
    const rawSymptoms = data.symptoms ?? {};
    const symptomScores = Object.fromEntries(
      SYMPTOM_LIST.map((s) => [s, Math.min(6, Math.max(0, Number(rawSymptoms[s] ?? 0)))])
    ) as SymptomScores;

    const vomsTests: VOMSTestResult[] = VOMS_TESTS.map((test) => {
      const entry = data.voms?.[test];
      const pre = {
        headache:  Number(entry?.pre?.headache  ?? 0),
        dizziness: Number(entry?.pre?.dizziness ?? 0),
        nausea:    Number(entry?.pre?.nausea    ?? 0),
        fogginess: Number(entry?.pre?.fogginess ?? 0),
      };
      const post = {
        headache:  Number(entry?.post?.headache  ?? 0),
        dizziness: Number(entry?.post?.dizziness ?? 0),
        nausea:    Number(entry?.post?.nausea    ?? 0),
        fogginess: Number(entry?.post?.fogginess ?? 0),
      };
      const npcDistance = test === "Near Point of Convergence" && entry?.npcDistance !== undefined
        ? Number(entry.npcDistance)
        : undefined;
      return buildVOMSTestResult(test, pre, post, npcDistance);
    });

    const stages: ExertionalStage[] = (data.stages ?? []).map((s, i) => ({
      stage: i + 1,
      speed: s.speed ? Number(s.speed) : undefined,
      incline: s.incline ? Number(s.incline) : undefined,
      duration: s.duration ? Number(s.duration) : undefined,
      heartRate: Number(s.heartRate) || 0,
      rpe: Number(s.rpe) || 6,
      symptomScore: Number(s.symptomScore) || 0,
      notes: s.notes || undefined,
    })).filter((s) => s.heartRate > 0);

    const daysSinceInjury = calcDaysSinceInjury(data.injuryDate, data.evaluationDate);

    const evaluation = {
      id: `eval-${uuidv4()}`,
      athlete: {
        id: `ath-${uuidv4()}`,
        name: data.athleteName,
        dateOfBirth: data.dateOfBirth,
        sport: data.sport,
        position: data.position,
        injuryDate: data.injuryDate,
        evaluationDate: data.evaluationDate,
        daysSinceInjury,
        notes: data.notes,
      },
      symptoms: calculateSymptomResults(symptomScores, data.percentageOfNormal ? Number(data.percentageOfNormal) : undefined),
      voms: calculateVOMSResults(vomsTests),
      exertional: calculateExertionalResults({
        stages,
        restingHeartRate: Number(data.restingHeartRate) || 60,
        stopReason: data.stopReason,
        notes: data.exertionalNotes,
      }),
      completedAt: new Date().toISOString(),
    };

    addEvaluation(evaluation);
    setSaved(true);
    setTimeout(() => router.push(`/report/${evaluation.id}`), 1200);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Evaluation saved!</h2>
        <p className="text-gray-500">Redirecting to the report…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Evaluation</h1>
        <p className="text-sm text-gray-500 mt-1">Complete all sections to generate a full report</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={clsx(
              "shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              step === i
                ? "bg-indigo-600 text-white"
                : i < step
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-400"
            )}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0 — Profile */}
        {step === 0 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
            <AthleteForm register={register} errors={errors} />
          </Card>
        )}

        {/* Step 1 — Symptoms */}
        {step === 1 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Symptom Checklist</h2>
            <p className="text-sm text-gray-500 mb-4">Ask the athlete to rate each symptom from 0 (none) to 6 (severe).</p>
            <SymptomEntryForm register={register} control={control} />
          </Card>
        )}

        {/* Step 2 — VOMS */}
        {step === 2 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">VOMS Assessment</h2>
            <p className="text-sm text-gray-500 mb-4">Record baseline symptom score before each test, then post-test score immediately after. For NPC, also record the convergence distance in cm.</p>
            <VOMSEntryForm register={register} control={control} setValue={setValue} />
          </Card>
        )}

        {/* Step 3 — Exertional */}
        {step === 3 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Exertional Testing</h2>
            <p className="text-sm text-gray-500 mb-4">Record each stage of the exertional protocol. Add stages as needed. Delete unused rows.</p>
            <ExertionalEntryForm register={register} control={control} watch={watch} />
          </Card>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Review & Save</h2>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-700">
                All sections have been completed. Click <strong>Save Evaluation</strong> below to generate the report.
              </p>
            </div>
            <div className="text-sm text-gray-600 space-y-1.5">
              <p>• Athlete: <strong>{watch("athleteName") || "—"}</strong></p>
              <p>• Sport: <strong>{watch("sport") || "—"}</strong></p>
              <p>• Evaluation date: <strong>{watch("evaluationDate") || "—"}</strong></p>
              <p>• Exertional stages entered: <strong>{(watch("stages") ?? []).filter((s) => s.heartRate).length}</strong></p>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Evaluation ✓
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
