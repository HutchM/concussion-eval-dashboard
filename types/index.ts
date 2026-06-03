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

export interface VOMSSymptomSet {
  headache: number;  // 0–10
  dizziness: number; // 0–10
  nausea: number;    // 0–10
  fogginess: number; // 0–10
}

export const VOMS_SYMPTOMS = ["headache", "dizziness", "nausea", "fogginess"] as const;
export type VOMSSymptomName = (typeof VOMS_SYMPTOMS)[number];

export interface VOMSTestResult {
  test: VOMSTestName;
  pre: VOMSSymptomSet;
  post: VOMSSymptomSet;
  changeScores: VOMSSymptomSet; // auto-calculated per symptom
  npcDistance?: number;         // cm — only for NPC test
  provoked: boolean;            // any change >= 2, or NPC > 5 cm
  notes?: string;
}

export interface VOMSResults {
  tests: VOMSTestResult[];
  provokedCount: number;
  anyProvoked: boolean;
  overallFlag: "Pass" | "Caution" | "Flag";
}

// ─── Exertional Testing ────────────────────────────────────────────────────────

export const EXERTIONAL_STAGE_DEFS = [
  { id: 1, name: "Cardiovascular Load",          hasTasks: true  },
  { id: 2, name: "Head Acceleration / Movement", hasTasks: true  },
  { id: 3, name: "Dual Task",                    hasTasks: true  },
  { id: 4, name: "Multi-planar / High Exertion", hasTasks: false },
] as const;

export const EXERTIONAL_TASK_NAMES = ["Squats", "Lunges", "Hip Hinges"] as const;
export type ExertionalTaskName = (typeof EXERTIONAL_TASK_NAMES)[number];

export interface ExertionalTaskResult {
  task: ExertionalTaskName;
  heartRate: number;    // bpm
  rpe: number;          // Borg 6–20
  symptomScore: number; // 0–10
  notes?: string;
}

export interface ExertionalStageResult {
  stageId: number;
  stageName: string;
  tasks: ExertionalTaskResult[]; // Squats, Lunges, Hip Hinges for stages 1–3
  // Stage 4 uses these direct metrics (no sub-tasks)
  heartRate?: number;
  rpe?: number;
  symptomScore?: number;
  notes?: string;
}

export type StopReason =
  | "Symptom provocation"
  | "Volitional fatigue"
  | "Protocol complete"
  | "Physician stopped"
  | "Other";

export interface ExertionalResults {
  stages: ExertionalStageResult[];
  restingHeartRate: number;
  maxHeartRate?: number;
  symptomThresholdInfo?: string; // plain text e.g. "Stage 2 – Lunges"
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
