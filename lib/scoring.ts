import type {
  SymptomScores,
  SymptomResults,
  VOMSTestResult,
  VOMSResults,
  ExertionalResults,
  ExertionalStage,
} from "@/types";

// ─── Symptom Scoring ──────────────────────────────────────────────────────────

export function calculateSymptomResults(scores: SymptomScores, percentageOfNormal?: number): SymptomResults {
  const values = Object.values(scores) as number[];
  const totalCount = values.filter((v) => v > 0).length;
  const totalSeverity = values.reduce((sum, v) => sum + v, 0);

  let severityCategory: SymptomResults["severityCategory"] = "None";
  if (totalSeverity > 0 && totalSeverity <= 20) severityCategory = "Mild";
  else if (totalSeverity > 20 && totalSeverity <= 40) severityCategory = "Moderate";
  else if (totalSeverity > 40) severityCategory = "Severe";

  return { scores, totalCount, totalSeverity, severityCategory, percentageOfNormal };
}

// ─── VOMS Scoring ─────────────────────────────────────────────────────────────

export function calculateVOMSResults(tests: VOMSTestResult[]): VOMSResults {
  const provokedCount = tests.filter((t) => t.provoked).length;
  const anyProvoked = provokedCount > 0;

  let overallFlag: VOMSResults["overallFlag"] = "Pass";
  if (provokedCount >= 3) overallFlag = "Flag";
  else if (provokedCount >= 1) overallFlag = "Caution";

  return { tests, provokedCount, anyProvoked, overallFlag };
}

export function isVOMSProvoked(
  test: Pick<VOMSTestResult, "changeScore" | "npcDistance">
): boolean {
  if (test.npcDistance !== undefined) return test.npcDistance > 5;
  return test.changeScore >= 2;
}

// ─── Exertional Scoring ───────────────────────────────────────────────────────

export function calculateExertionalResults(
  partial: Omit<ExertionalResults, "maxHeartRate" | "symptomThresholdHR" | "exertionalTolerance"> & {
    stages: ExertionalStage[];
  }
): ExertionalResults {
  const { stages } = partial;

  const maxHeartRate =
    stages.length > 0 ? Math.max(...stages.map((s) => s.heartRate)) : undefined;

  // First stage where symptom score increased compared to the previous stage
  let symptomThresholdHR: number | undefined;
  for (let i = 1; i < stages.length; i++) {
    if (stages[i].symptomScore > stages[i - 1].symptomScore) {
      symptomThresholdHR = stages[i].heartRate;
      break;
    }
  }

  let exertionalTolerance: ExertionalResults["exertionalTolerance"] = "Full";
  if (partial.stopReason === "Symptom provocation") {
    exertionalTolerance =
      stages.length <= 2 ? "Unable to complete" : "Symptom-limited";
  }

  return {
    ...partial,
    maxHeartRate,
    symptomThresholdHR,
    exertionalTolerance,
  };
}

// ─── Days since injury ────────────────────────────────────────────────────────

export function calcDaysSinceInjury(injuryDate: string, evalDate: string): number {
  const injury = new Date(injuryDate);
  const evaluation = new Date(evalDate);
  const diffMs = evaluation.getTime() - injury.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
