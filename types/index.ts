// ─── Athlete / Patient ────────────────────────────────────────────────────────

export interface Athlete {
  id: string;
  name: string;
  dateOfBirth: string; // ISO
  sport: string;
  position?: string;
  injuryDate: string; // ISO
  evaluationDate: string; // ISO
  daysSinceInjury: number;
  clinicianName?: string;
  notes?: string;
}

// ─── Symptoms ─────────────────────────────────────────────────────────────────

export const SYMPTOM_LIST = [
  "Headache",
  "Pressure in head",
  "Neck pain",
  "Nausea or vomiting",
  "Dizziness",
  "Blurred vision",
  "Balance problems",
  "Sensitivity to light",
  "Sensitivity to noise",
  "Feeling slowed down",
  "Feeling like in a fog",
  "Don't feel right",
  "Difficulty concentrating",
  "Difficulty remembering",
  "Fatigue or low energy",
  "Confusion",
  "Drowsiness",
  "Trouble falling asleep",
  "More emotional than usual",
  "Irritability",
  "Sadness",
  "Nervous or anxious",
] as const;

export type SymptomName = (typeof SYMPTOM_LIST)[number];

export type SymptomRating = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SymptomScores = Record<SymptomName, SymptomRating>;

export interface SymptomResults {
  scores: SymptomScores;
  totalCount: number;   // number of symptoms > 0
  totalSeverity: number; // sum of all ratings (max 132)
  severityCategory: "None" | "Mild" | "Moderate" | "Severe";
  percentageOfNormal?: number; // 0–100, patient-reported
}

// ─── VOMS ──────────────────────────────────────────────────────────────────────

export const VOMS_TESTS = [
  "Smooth Pursuit",
  "Horizontal Saccades",
  "Vertical Saccades",
  "Near Point of Convergence",
  "Horizontal VOR",
  "Vertical VOR",
  "Visual Motion Sensitivity",
] as const;

export type VOMSTestName = (typeof VOMS_TESTS)[number];

export interface VOMSTestResult {
  test: VOMSTestName;
  baselineSymptoms: number; // 0–10
  postSymptoms: number;     // 0–10
  changeScore: number;      // auto-calculated
  npcDistance?: number;     // cm — only for NPC test
  provoked: boolean;        // change >= 2 (or NPC > 5 cm)
  notes?: string;
}

export interface VOMSResults {
  tests: VOMSTestResult[];
  provokedCount: number;
  anyProvoked: boolean;
  overallFlag: "Pass" | "Caution" | "Flag";
}

// ─── Exertional Testing ────────────────────────────────────────────────────────

export interface ExertionalStage {
  stage: number;
  speed?: number;       // km/h or mph
  incline?: number;     // %
  duration?: number;    // minutes
  heartRate: number;    // bpm
  rpe: number;          // Borg 6–20
  symptomScore: number; // 0–10
  notes?: string;
}

export type StopReason =
  | "Symptom provocation"
  | "Volitional fatigue"
  | "Protocol complete"
  | "Physician stopped"
  | "Other";

export interface ExertionalResults {
  stages: ExertionalStage[];
  restingHeartRate: number;
  maxHeartRate?: number;
  symptomThresholdHR?: number; // HR when symptoms first increased
  stopReason: StopReason;
  exertionalTolerance: "Full" | "Symptom-limited" | "Unable to complete";
  notes?: string;
}

// ─── Full Evaluation ──────────────────────────────────────────────────────────

export interface Evaluation {
  id: string;
  athlete: Athlete;
  symptoms: SymptomResults;
  voms: VOMSResults;
  exertional: ExertionalResults;
  completedAt: string; // ISO
}
