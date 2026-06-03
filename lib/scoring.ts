import type {
  SymptomScores,
  SymptomResults,
  VOMSTestResult,
  VOMSResults,
  ExertionalResults,
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

export function buildVOMSTestResult(
  test: VOMSTestResult["test"],
  pre: VOMSTestResult["pre"],
  post: VOMSTestResult["post"],
  npcDistance?: number
): VOMSTestResult {
  const changeScores = {
    headache:  post.headache  - pre.headache,
    dizziness: post.dizziness - pre.dizziness,
    nausea:    post.nausea    - pre.nausea,
    fogginess: post.fogginess - pre.fogginess,
  };
  const anySymptomProvoked = Object.values(changeScores).some((c) => c >= 2);
  const npcProvoked = npcDistance !== undefined && npcDistance > 5;
  const provoked = anySymptomProvoked || npcProvoked;
  return { test, pre, post, changeScores, npcDistance, provoked };
}

// ─── Exertional Scoring ───────────────────────────────────────────────────────

export function calculateExertionalResults(
  partial: Omit<ExertionalResults, "symptomThresholdInfo" | "exertionalTolerance">
): ExertionalResults {
  const { stages } = partial;

  // Find first task where symptoms increased above 0
  let symptomThresholdInfo: string | undefined;
  outer: for (const stage of stages) {
    if (stage.tasks.length > 0) {
      for (const task of stage.tasks) {
        if (task.symptomScore > 0) {
          symptomThresholdInfo = `${stage.stageName} – ${task.task}`;
          break outer;
        }
      }
    } else if ((stage.symptomScore ?? 0) > 0) {
      symptomThresholdInfo = stage.stageName;
      break;
    }
  }

  let exertionalTolerance: ExertionalResults["exertionalTolerance"] = "Full";
  if (partial.stopReason === "Symptom provocation") {
    const stoppedEarly = stages.length <= 1 && stages[0]?.tasks.length <= 1;
    exertionalTolerance = stoppedEarly ? "Unable to complete" : "Symptom-limited";
  }

  return { ...partial, symptomThresholdInfo, exertionalTolerance };
}

// ─── Days since injury ────────────────────────────────────────────────────────

export function calcDaysSinceInjury(injuryDate: string, evalDate: string): number {
  const injury = new Date(injuryDate);
  const evaluation = new Date(evalDate);
  const diffMs = evaluation.getTime() - injury.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
