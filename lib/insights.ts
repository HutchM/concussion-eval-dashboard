import type { Evaluation } from "@/types";

export interface ClinicalInsight {
  domain: "Symptoms" | "VOMS" | "Exertional" | "Overall";
  level: "info" | "caution" | "flag";
  text: string;
}

export interface PatientInsight {
  domain: string;
  emoji: string;
  headline: string;
  detail: string;
}

// ─── Practitioner insights ────────────────────────────────────────────────────

export function generateClinicalInsights(e: Evaluation): ClinicalInsight[] {
  const insights: ClinicalInsight[] = [];
  const { symptoms, voms, exertional } = e;

  // Symptoms
  if (symptoms.totalSeverity === 0) {
    insights.push({ domain: "Symptoms", level: "info", text: "Athlete reports no symptoms at rest." });
  } else {
    insights.push({
      domain: "Symptoms",
      level: symptoms.severityCategory === "Severe" ? "flag" : symptoms.severityCategory === "Moderate" ? "caution" : "info",
      text: `Athlete endorses ${symptoms.totalCount} symptom${symptoms.totalCount !== 1 ? "s" : ""} with a total severity score of ${symptoms.totalSeverity}/132 (${symptoms.severityCategory}).`,
    });
  }

  // Symptom clusters
  const scores = symptoms.scores;
  const vestibularSymptoms = ["Dizziness", "Balance problems", "Blurred vision"] as const;
  const cognitiveSymptoms = ["Feeling slowed down", "Feeling like in a fog", "Difficulty concentrating", "Difficulty remembering"] as const;
  const vestibTotal = vestibularSymptoms.reduce((s, k) => s + (scores[k] ?? 0), 0);
  const cogTotal = cognitiveSymptoms.reduce((s, k) => s + (scores[k] ?? 0), 0);
  if (vestibTotal >= 4) insights.push({ domain: "Symptoms", level: "caution", text: "Elevated vestibular symptom cluster (dizziness, balance, blurred vision)." });
  if (cogTotal >= 4) insights.push({ domain: "Symptoms", level: "caution", text: "Elevated cognitive symptom cluster (fog, concentration, memory)." });

  // VOMS
  if (voms.overallFlag === "Pass") {
    insights.push({ domain: "VOMS", level: "info", text: "No clinically relevant symptom provocation on VOMS." });
  } else {
    const flaggedTests = voms.tests.filter((t) => t.provoked).map((t) => t.test);
    insights.push({
      domain: "VOMS",
      level: voms.overallFlag === "Flag" ? "flag" : "caution",
      text: `VOMS: ${voms.provokedCount} of 7 tests provoked symptoms — ${flaggedTests.join(", ")}.`,
    });
  }

  // NPC
  const npcResult = voms.tests.find((t) => t.test === "Near Point of Convergence");
  if (npcResult?.npcDistance !== undefined && npcResult.npcDistance > 5) {
    insights.push({ domain: "VOMS", level: "flag", text: `Near Point of Convergence elevated at ${npcResult.npcDistance} cm (normal < 5 cm).` });
  }

  // Exertional
  if (exertional.exertionalTolerance === "Full") {
    insights.push({ domain: "Exertional", level: "info", text: "Athlete completed exertional protocol without symptom provocation." });
  } else if (exertional.exertionalTolerance === "Unable to complete") {
    insights.push({ domain: "Exertional", level: "flag", text: "Athlete was unable to complete exertional testing due to early symptom provocation." });
  } else {
    const where = exertional.symptomThresholdInfo;
    insights.push({
      domain: "Exertional",
      level: "caution",
      text: where
        ? `Symptom-limited exertional tolerance. Symptoms first provoked at: ${where}.`
        : "Exertional testing was symptom-limited.",
    });
  }

  // Overall
  const flagCount = insights.filter((i) => i.level === "flag").length;
  const cautionCount = insights.filter((i) => i.level === "caution").length;
  if (flagCount === 0 && cautionCount === 0) {
    insights.push({ domain: "Overall", level: "info", text: "No domains flagged. Results appear within normal limits." });
  } else if (flagCount > 0) {
    insights.push({ domain: "Overall", level: "flag", text: `${flagCount} domain${flagCount > 1 ? "s" : ""} flagged for clinical follow-up.` });
  } else {
    insights.push({ domain: "Overall", level: "caution", text: "Some findings warrant further clinical monitoring." });
  }

  return insights;
}

// ─── Patient-friendly insights ────────────────────────────────────────────────

export function generatePatientInsights(e: Evaluation): PatientInsight[] {
  const insights: PatientInsight[] = [];
  const { symptoms, voms, exertional } = e;

  // Symptoms
  if (symptoms.totalSeverity === 0) {
    insights.push({
      domain: "How You're Feeling",
      emoji: "✅",
      headline: "You reported no symptoms at rest",
      detail: "That's a positive sign. Having no symptoms at rest is an important milestone in recovery.",
    });
  } else {
    insights.push({
      domain: "How You're Feeling",
      emoji: symptoms.severityCategory === "Severe" ? "🔴" : symptoms.severityCategory === "Moderate" ? "🟡" : "🟠",
      headline: `You reported ${symptoms.totalCount} symptom${symptoms.totalCount !== 1 ? "s" : ""} (${symptoms.severityCategory.toLowerCase()} severity)`,
      detail: "Your symptoms were checked across multiple areas. Your clinician will review these with you to understand how you're feeling day-to-day.",
    });
  }

  // VOMS
  if (voms.overallFlag === "Pass") {
    insights.push({
      domain: "Eye and Balance Testing",
      emoji: "✅",
      headline: "Your eye and balance tests did not trigger symptoms",
      detail: "Tests that move your eyes and challenge your balance did not cause noticeable symptom changes. This is a positive finding.",
    });
  } else {
    const flaggedTests = voms.tests.filter((t) => t.provoked).map((t) => t.test);
    insights.push({
      domain: "Eye and Balance Testing",
      emoji: voms.overallFlag === "Flag" ? "🔴" : "🟡",
      headline: `Some eye and balance movements triggered symptoms`,
      detail: `The following tests caused a noticeable increase in symptoms: ${flaggedTests.join(", ")}. This tells your clinician which visual and balance systems may need extra attention during recovery.`,
    });
  }

  // Exertional
  if (exertional.exertionalTolerance === "Full") {
    insights.push({
      domain: "Exercise Tolerance",
      emoji: "✅",
      headline: "You completed the full exercise test without symptoms increasing",
      detail: "This is an excellent sign. Being able to exercise without triggering symptoms suggests your brain is tolerating physical stress well.",
    });
  } else if (exertional.exertionalTolerance === "Unable to complete") {
    insights.push({
      domain: "Exercise Tolerance",
      emoji: "🔴",
      headline: "Exercise triggered symptoms early in the test",
      detail: "Your symptoms increased during low-level exercise. This is common after a concussion and helps your clinician understand where to start your recovery program.",
    });
  } else {
    const where = exertional.symptomThresholdInfo;
    insights.push({
      domain: "Exercise Tolerance",
      emoji: "🟡",
      headline: "You were able to exercise but symptoms increased at higher intensities",
      detail: where
        ? `Your symptoms started to increase during ${where}. This gives your clinician a starting point for your exercise rehabilitation program.`
        : "Your symptoms increased at higher exercise intensities. Your clinician will use this information to set safe exercise targets.",
    });
  }

  return insights;
}
