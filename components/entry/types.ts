import type { SymptomName, VOMSTestName, StopReason } from "@/types";

export interface ExertionalTaskEntry {
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

  // VOMS — pre/post for each of 4 symptoms per test
  voms: Record<string, {
    pre:  { headache: number; dizziness: number; nausea: number; fogginess: number };
    post: { headache: number; dizziness: number; nausea: number; fogginess: number };
    npcDistance?: number;
  }>;

  // Exertional — structured 4-stage protocol
  stopReason: StopReason;
  exertionalNotes?: string;
  // Stages 1–3: keyed by stageId, then taskName
  exertionalTasks: Record<string, Record<string, ExertionalTaskEntry>>;
  // Stage 4: single entry
  exertionalStage4: ExertionalTaskEntry;
}
