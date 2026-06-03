import type { SymptomName, VOMSTestName, StopReason } from "@/types";

export interface SymptomEntry {
  name: SymptomName;
  rating: number;
}

export interface VOMSEntry {
  test: VOMSTestName;
  baselineSymptoms: number;
  postSymptoms: number;
  npcDistance?: number;
}

export interface ExertionalStageEntry {
  stage: number;
  speed: string;
  incline: string;
  duration: string;
  heartRate: string;
  rpe: string;
  symptomScore: string;
  notes: string;
}

export interface EntryFormValues {
  // Athlete
  athleteName: string;
  dateOfBirth: string;
  sport: string;
  position?: string;
  injuryDate: string;
  evaluationDate: string;
  notes?: string;

  // Symptoms — keyed by symptom name
  symptoms: Record<string, number>;
  percentageOfNormal: string;

  // VOMS
  voms: Record<string, { baseline: number; post: number; npcDistance?: number }>;

  // Exertional
  restingHeartRate: string;
  stopReason: StopReason;
  exertionalNotes?: string;
  stages: ExertionalStageEntry[];
}
