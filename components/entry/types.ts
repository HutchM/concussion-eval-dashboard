import type { SymptomName, VOMSTestName, StopReason } from "@/types";

export interface SymptomOccurrenceEntry {
  name: string;
  increase: string;
}

export interface ExertionalTaskEntry {
  reps: string;            // stages 1 & 3
  duration: string;        // stage 2 (seconds)
  symptomProvoked: string; // "yes" | "no" | ""
  symptoms: SymptomOccurrenceEntry[];
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
  immediateMemory: { trial1: string; trial2: string; trial3: string };
  exertionalNotes?: string;
  // End-of-stage RPE keyed by stageId
  stageRPE: Record<string, string>;
  // Stages 1–3: keyed by stageId, then taskName
  exertionalTasks: Record<string, Record<string, ExertionalTaskEntry>>;
}
