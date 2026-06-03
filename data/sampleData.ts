import type { Evaluation } from "@/types";
import { calculateSymptomResults, calculateVOMSResults, calculateExertionalResults, buildVOMSTestResult } from "@/lib/scoring";
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
  buildVOMSTestResult("Smooth Pursuit",           { headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:2, dizziness:3, nausea:1, fogginess:3 }),
  buildVOMSTestResult("Horizontal Saccades",      { headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:4, dizziness:5, nausea:2, fogginess:3 }),
  buildVOMSTestResult("Vertical Saccades",        { headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:3, dizziness:4, nausea:2, fogginess:3 }),
  buildVOMSTestResult("Near Point of Convergence",{ headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:3, dizziness:3, nausea:2, fogginess:3 }, 7),
  buildVOMSTestResult("Horizontal VOR",           { headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:2, dizziness:3, nausea:1, fogginess:2 }),
  buildVOMSTestResult("Vertical VOR",             { headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:2, dizziness:2, nausea:1, fogginess:3 }),
  buildVOMSTestResult("Visual Motion Sensitivity",{ headache:2, dizziness:2, nausea:1, fogginess:2 }, { headache:5, dizziness:6, nausea:3, fogginess:4 }),
];

const eval1Exertional = calculateExertionalResults({
  stages: [
    {
      stageId: 1, stageName: "Cardiovascular Load",
      tasks: [
        { task: "Squats",     rpe: 9,  symptomScore: 0 },
        { task: "Lunges",     rpe: 10, symptomScore: 0 },
        { task: "Hip Hinges", rpe: 11, symptomScore: 1 },
      ],
    },
    {
      stageId: 2, stageName: "Head Acceleration / Movement",
      tasks: [
        { task: "Squats",     rpe: 12, symptomScore: 2 },
        { task: "Lunges",     rpe: 13, symptomScore: 3 },
        { task: "Hip Hinges", rpe: 14, symptomScore: 4, notes: "Headache increased" },
      ],
    },
  ],
  
  stopReason: "Symptom provocation",
  notes: "Stopped at Stage 2 Hip Hinges due to significant headache increase.",
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
      notes: "First post-injury evaluation. Patient reports difficulty at school.",
    },
    symptoms: calculateSymptomResults(eval1Scores, 40),
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
      notes: "Second evaluation. Significant improvement noted since initial assessment.",
    },
    symptoms: calculateSymptomResults({
      ...zeroScores(),
      "Headache": 1,
      "Fatigue or low energy": 2,
      "Sensitivity to light": 1,
    }, 85),
    voms: calculateVOMSResults([
      buildVOMSTestResult("Smooth Pursuit",           { headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:0, nausea:0, fogginess:1 }),
      buildVOMSTestResult("Horizontal Saccades",      { headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:1, nausea:0, fogginess:1 }),
      buildVOMSTestResult("Vertical Saccades",        { headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:1, nausea:0, fogginess:1 }),
      buildVOMSTestResult("Near Point of Convergence",{ headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:0, nausea:0, fogginess:1 }, 4),
      buildVOMSTestResult("Horizontal VOR",           { headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:0, nausea:0, fogginess:1 }),
      buildVOMSTestResult("Vertical VOR",             { headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:0, nausea:0, fogginess:1 }),
      buildVOMSTestResult("Visual Motion Sensitivity",{ headache:1, dizziness:0, nausea:0, fogginess:1 }, { headache:1, dizziness:2, nausea:0, fogginess:2 }),
    ]),
    exertional: calculateExertionalResults({
      stages: [
        {
          stageId: 1, stageName: "Cardiovascular Load",
          tasks: [
            { task: "Squats",     rpe: 8,  symptomScore: 0 },
            { task: "Lunges",     rpe: 9,  symptomScore: 0 },
            { task: "Hip Hinges", rpe: 9,  symptomScore: 0 },
          ],
        },
        {
          stageId: 2, stageName: "Head Acceleration / Movement",
          tasks: [
            { task: "Squats",     rpe: 11, symptomScore: 0 },
            { task: "Lunges",     rpe: 11, symptomScore: 0 },
            { task: "Hip Hinges", rpe: 12, symptomScore: 0 },
          ],
        },
        {
          stageId: 3, stageName: "Dual Task",
          tasks: [
            { task: "Squats",     rpe: 13, symptomScore: 1 },
            { task: "Lunges",     rpe: 13, symptomScore: 1 },
            { task: "Hip Hinges", rpe: 14, symptomScore: 1 },
          ],
        },
        {
          stageId: 4, stageName: "Multi-planar / High Exertion",
          tasks: [], rpe: 16, symptomScore: 1,
          notes: "Completed full protocol without significant symptom change.",
        },
      ],
      
      stopReason: "Protocol complete",
      notes: "Full protocol completed. Minimal symptom response throughout.",
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
    }, 15),
    voms: calculateVOMSResults([
      buildVOMSTestResult("Smooth Pursuit",           { headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:6, dizziness:7, nausea:4, fogginess:6 }),
      buildVOMSTestResult("Horizontal Saccades",      { headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:7, dizziness:8, nausea:5, fogginess:7 }),
      buildVOMSTestResult("Vertical Saccades",        { headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:6, dizziness:7, nausea:4, fogginess:6 }),
      buildVOMSTestResult("Near Point of Convergence",{ headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:7, dizziness:8, nausea:5, fogginess:7 }, 12),
      buildVOMSTestResult("Horizontal VOR",           { headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:7, dizziness:8, nausea:5, fogginess:6 }),
      buildVOMSTestResult("Vertical VOR",             { headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:6, dizziness:7, nausea:4, fogginess:6 }),
      buildVOMSTestResult("Visual Motion Sensitivity",{ headache:4, dizziness:4, nausea:2, fogginess:4 }, { headache:8, dizziness:9, nausea:6, fogginess:8 }),
    ]),
    exertional: calculateExertionalResults({
      stages: [
        {
          stageId: 1, stageName: "Cardiovascular Load",
          tasks: [
            { task: "Squats",     rpe: 10, symptomScore: 5 },
            { task: "Lunges",     rpe: 11, symptomScore: 7, notes: "Reported severe headache and nausea" },
          ],
        },
      ],
      
      stopReason: "Symptom provocation",
      notes: "Stopped during Stage 1 Lunges. Severe headache and nausea. Patient unable to continue.",
    }),
    completedAt: "2024-11-16T09:15:00Z",
  },
];
