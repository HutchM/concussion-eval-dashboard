import type { Evaluation } from "@/types";
import { calculateSymptomResults, calculateVOMSResults, calculateExertionalResults } from "@/lib/scoring";
import { SYMPTOM_LIST } from "@/types";

// Helper to build a zeroed symptom scores object
function zeroScores() {
  return Object.fromEntries(SYMPTOM_LIST.map((s) => [s, 0])) as Record<typeof SYMPTOM_LIST[number], 0>;
}

// ─── Sample Evaluation 1 – Moderate presentation ─────────────────────────────

const eval1Scores = {
  ...zeroScores(),
  "Headache": 4,
  "Pressure in head": 3,
  "Dizziness": 3,
  "Blurred vision": 2,
  "Balance problems": 2,
  "Sensitivity to light": 4,
  "Sensitivity to noise": 3,
  "Feeling slowed down": 3,
  "Feeling like in a fog": 4,
  "Difficulty concentrating": 3,
  "Difficulty remembering": 2,
  "Fatigue or low energy": 4,
  "Drowsiness": 2,
} as const;

const eval1VOMS = [
  { test: "Smooth Pursuit" as const, baselineSymptoms: 3, postSymptoms: 4, changeScore: 1, provoked: false },
  { test: "Horizontal Saccades" as const, baselineSymptoms: 3, postSymptoms: 6, changeScore: 3, provoked: true },
  { test: "Vertical Saccades" as const, baselineSymptoms: 3, postSymptoms: 5, changeScore: 2, provoked: true },
  { test: "Near Point of Convergence" as const, baselineSymptoms: 3, postSymptoms: 5, changeScore: 2, npcDistance: 7, provoked: true },
  { test: "Horizontal VOR" as const, baselineSymptoms: 3, postSymptoms: 4, changeScore: 1, provoked: false },
  { test: "Vertical VOR" as const, baselineSymptoms: 3, postSymptoms: 4, changeScore: 1, provoked: false },
  { test: "Visual Motion Sensitivity" as const, baselineSymptoms: 3, postSymptoms: 7, changeScore: 4, provoked: true },
];

const eval1Exertional = calculateExertionalResults({
  stages: [
    { stage: 1, speed: 3.2, incline: 0, duration: 2, heartRate: 78, rpe: 8, symptomScore: 3 },
    { stage: 2, speed: 4.0, incline: 0, duration: 2, heartRate: 95, rpe: 10, symptomScore: 3 },
    { stage: 3, speed: 4.8, incline: 2, duration: 2, heartRate: 110, rpe: 12, symptomScore: 4 },
    { stage: 4, speed: 5.6, incline: 4, duration: 2, heartRate: 126, rpe: 14, symptomScore: 6 },
  ],
  restingHeartRate: 68,
  stopReason: "Symptom provocation",
  notes: "Headache and dizziness increased notably at stage 4.",
});

export const SAMPLE_EVALUATIONS: Evaluation[] = [
  {
    id: "eval-001",
    athlete: {
      id: "ath-001",
      name: "Jordan Mitchell",
      dateOfBirth: "2002-05-14",
      sport: "Rugby",
      position: "Flanker",
      injuryDate: "2024-11-10",
      evaluationDate: "2024-11-17",
      daysSinceInjury: 7,
      clinicianName: "Dr. Sarah Chen",
      notes: "First post-injury evaluation. Patient reports difficulty at school.",
    },
    symptoms: calculateSymptomResults(eval1Scores),
    voms: calculateVOMSResults(eval1VOMS),
    exertional: eval1Exertional,
    completedAt: "2024-11-17T10:30:00Z",
  },

  // ─── Sample Evaluation 2 – Mild / near-resolved ──────────────────────────────
  {
    id: "eval-002",
    athlete: {
      id: "ath-002",
      name: "Alex Rivera",
      dateOfBirth: "2001-08-22",
      sport: "Soccer",
      position: "Midfielder",
      injuryDate: "2024-10-28",
      evaluationDate: "2024-11-14",
      daysSinceInjury: 17,
      clinicianName: "Dr. James Park",
      notes: "Second evaluation. Significant improvement noted since initial assessment.",
    },
    symptoms: calculateSymptomResults({
      ...zeroScores(),
      "Headache": 1,
      "Fatigue or low energy": 2,
      "Sensitivity to light": 1,
    }),
    voms: calculateVOMSResults([
      { test: "Smooth Pursuit" as const, baselineSymptoms: 1, postSymptoms: 1, changeScore: 0, provoked: false },
      { test: "Horizontal Saccades" as const, baselineSymptoms: 1, postSymptoms: 2, changeScore: 1, provoked: false },
      { test: "Vertical Saccades" as const, baselineSymptoms: 1, postSymptoms: 2, changeScore: 1, provoked: false },
      { test: "Near Point of Convergence" as const, baselineSymptoms: 1, postSymptoms: 1, changeScore: 0, npcDistance: 4, provoked: false },
      { test: "Horizontal VOR" as const, baselineSymptoms: 1, postSymptoms: 1, changeScore: 0, provoked: false },
      { test: "Vertical VOR" as const, baselineSymptoms: 1, postSymptoms: 1, changeScore: 0, provoked: false },
      { test: "Visual Motion Sensitivity" as const, baselineSymptoms: 1, postSymptoms: 3, changeScore: 2, provoked: true },
    ]),
    exertional: calculateExertionalResults({
      stages: [
        { stage: 1, speed: 3.2, incline: 0, duration: 2, heartRate: 75, rpe: 7, symptomScore: 1 },
        { stage: 2, speed: 4.0, incline: 0, duration: 2, heartRate: 92, rpe: 9, symptomScore: 1 },
        { stage: 3, speed: 4.8, incline: 2, duration: 2, heartRate: 108, rpe: 11, symptomScore: 1 },
        { stage: 4, speed: 5.6, incline: 4, duration: 2, heartRate: 122, rpe: 13, symptomScore: 1 },
        { stage: 5, speed: 6.4, incline: 6, duration: 2, heartRate: 138, rpe: 15, symptomScore: 2 },
        { stage: 6, speed: 7.2, incline: 8, duration: 2, heartRate: 152, rpe: 17, symptomScore: 2 },
        { stage: 7, speed: 8.0, incline: 10, duration: 2, heartRate: 165, rpe: 18, symptomScore: 2 },
      ],
      restingHeartRate: 62,
      stopReason: "Protocol complete",
      notes: "Completed full protocol. Minimal symptom response throughout.",
    }),
    completedAt: "2024-11-14T14:00:00Z",
  },

  // ─── Sample Evaluation 3 – Severe presentation ───────────────────────────────
  {
    id: "eval-003",
    athlete: {
      id: "ath-003",
      name: "Casey Thompson",
      dateOfBirth: "2003-02-07",
      sport: "Ice Hockey",
      position: "Defense",
      injuryDate: "2024-11-13",
      evaluationDate: "2024-11-16",
      daysSinceInjury: 3,
      clinicianName: "Dr. Sarah Chen",
      notes: "Acute presentation. Currently unable to attend school. Sleep severely disrupted.",
    },
    symptoms: calculateSymptomResults({
      ...zeroScores(),
      "Headache": 5,
      "Pressure in head": 5,
      "Neck pain": 4,
      "Nausea or vomiting": 3,
      "Dizziness": 5,
      "Blurred vision": 4,
      "Balance problems": 5,
      "Sensitivity to light": 6,
      "Sensitivity to noise": 6,
      "Feeling slowed down": 5,
      "Feeling like in a fog": 5,
      "Don't feel right": 5,
      "Difficulty concentrating": 5,
      "Difficulty remembering": 4,
      "Fatigue or low energy": 5,
      "Confusion": 3,
      "Drowsiness": 4,
      "Trouble falling asleep": 4,
      "More emotional than usual": 3,
      "Irritability": 3,
    }),
    voms: calculateVOMSResults([
      { test: "Smooth Pursuit" as const, baselineSymptoms: 5, postSymptoms: 8, changeScore: 3, provoked: true },
      { test: "Horizontal Saccades" as const, baselineSymptoms: 5, postSymptoms: 9, changeScore: 4, provoked: true },
      { test: "Vertical Saccades" as const, baselineSymptoms: 5, postSymptoms: 8, changeScore: 3, provoked: true },
      { test: "Near Point of Convergence" as const, baselineSymptoms: 5, postSymptoms: 9, changeScore: 4, npcDistance: 12, provoked: true },
      { test: "Horizontal VOR" as const, baselineSymptoms: 5, postSymptoms: 9, changeScore: 4, provoked: true },
      { test: "Vertical VOR" as const, baselineSymptoms: 5, postSymptoms: 8, changeScore: 3, provoked: true },
      { test: "Visual Motion Sensitivity" as const, baselineSymptoms: 5, postSymptoms: 10, changeScore: 5, provoked: true },
    ]),
    exertional: calculateExertionalResults({
      stages: [
        { stage: 1, speed: 3.2, incline: 0, duration: 1, heartRate: 82, rpe: 9, symptomScore: 5 },
        { stage: 2, speed: 3.2, incline: 0, duration: 1, heartRate: 90, rpe: 10, symptomScore: 8 },
      ],
      restingHeartRate: 72,
      stopReason: "Symptom provocation",
      notes: "Test stopped early. Patient reported severe headache increase and nausea within first 2 stages.",
    }),
    completedAt: "2024-11-16T09:15:00Z",
  },
];
