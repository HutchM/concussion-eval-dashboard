import type { Evaluation } from "@/types";
import { calculateSymptomResults, calculateVOMSResults, calculateExertionalResults, buildVOMSTestResult } from "@/lib/scoring";
import { SYMPTOM_LIST, IMMEDIATE_MEMORY_WORDS } from "@/types";

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
      immediateMemory: { words: [...IMMEDIATE_MEMORY_WORDS], trial1: 7, trial2: 9, trial3: 9, totalScore: 25 },
      rpe: 11,
      tasks: [
        { task: "Squats",     reps: 10, symptomProvoked: false, symptomDetails: [] },
        { task: "Lunges",     reps: 10, symptomProvoked: false, symptomDetails: [] },
        { task: "Hip Hinges", reps: 10, symptomProvoked: true,  symptomDetails: [{ symptom: "Headache", increase: 1 }] },
      ],
    },
    {
      stageId: 2, stageName: "Head Acceleration / Movement",
      rpe: 14,
      tasks: [
        { task: "Squats",     duration: 30, symptomProvoked: true,  symptomDetails: [{ symptom: "Headache", increase: 2 }, { symptom: "Dizziness", increase: 1 }] },
        { task: "Lunges",     duration: 30, symptomProvoked: true,  symptomDetails: [{ symptom: "Headache", increase: 3 }, { symptom: "Dizziness", increase: 2 }] },
        { task: "Hip Hinges", duration: 20, symptomProvoked: true,  symptomDetails: [{ symptom: "Headache", increase: 4 }, { symptom: "Nausea or vomiting", increase: 2 }], notes: "Test stopped" },
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
          immediateMemory: { words: [...IMMEDIATE_MEMORY_WORDS], trial1: 10, trial2: 11, trial3: 12, totalScore: 33 },
          rpe: 9,
          tasks: [
            { task: "Squats",     reps: 12, symptomProvoked: false, symptomDetails: [] },
            { task: "Lunges",     reps: 12, symptomProvoked: false, symptomDetails: [] },
            { task: "Hip Hinges", reps: 12, symptomProvoked: false, symptomDetails: [] },
          ],
        },
        {
          stageId: 2, stageName: "Head Acceleration / Movement",
          rpe: 12,
          tasks: [
            { task: "Squats",     duration: 30, symptomProvoked: false, symptomDetails: [] },
            { task: "Lunges",     duration: 30, symptomProvoked: false, symptomDetails: [] },
            { task: "Hip Hinges", duration: 30, symptomProvoked: false, symptomDetails: [] },
          ],
        },
        {
          stageId: 3, stageName: "Dual Task",
          rpe: 14,
          tasks: [
            { task: "Squats",     reps: 10, symptomProvoked: true, symptomDetails: [{ symptom: "Fatigue or low energy", increase: 1 }] },
            { task: "Lunges",     reps: 10, symptomProvoked: true, symptomDetails: [{ symptom: "Fatigue or low energy", increase: 1 }] },
            { task: "Hip Hinges", reps: 10, symptomProvoked: true, symptomDetails: [{ symptom: "Fatigue or low energy", increase: 1 }] },
          ],
        },
        {
          stageId: 4, stageName: "Multi-planar / High Exertion",
          rpe: 16,
          tasks: [
            { task: "12 Step Down Jumps",       reps: 12, symptomProvoked: false, symptomDetails: [] },
            { task: "Box Jump Overs",            reps: 10, symptomProvoked: false, symptomDetails: [] },
            { task: "Box Jump Overs with HLVT",  reps: 10, symptomProvoked: false, symptomDetails: [] },
          ],
          notes: "Completed without significant symptom change.",
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
            { task: "Squats",     reps: 5, symptomProvoked: true, symptomDetails: [{ symptom: "Headache", increase: 5 }, { symptom: "Dizziness", increase: 3 }] },
            { task: "Lunges",     reps: 3, symptomProvoked: true, symptomDetails: [{ symptom: "Headache", increase: 7 }, { symptom: "Nausea or vomiting", increase: 4 }], notes: "Stopped — severe symptoms" },
          ],
        },
      ],
      
      stopReason: "Symptom provocation",
      notes: "Stopped during Stage 1 Lunges. Severe headache and nausea. Patient unable to continue.",
    }),
    completedAt: "2024-11-16T09:15:00Z",
  },
];
