import type { SymptomName, SymptomScores } from "@/types";

export interface SymptomCategory {
  name: string;
  color: "blue" | "purple" | "amber" | "red" | "green" | "indigo" | "gray";
  symptoms: readonly SymptomName[];
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    name: "Vestibular",
    color: "blue",
    symptoms: ["Dizziness", "Balance problems", "Sensitivity to noise"],
  },
  {
    name: "Ocular",
    color: "purple",
    symptoms: ["Blurred vision", "Difficulty concentrating"],
  },
  {
    name: "Cognitive / Fatigue",
    color: "amber",
    symptoms: [
      "Feeling slowed down",
      "Feeling like in a fog",
      "Difficulty remembering",
      "Fatigue or low energy",
      "Confusion",
    ],
  },
  {
    name: "Post-Traumatic Migraine",
    color: "red",
    symptoms: [
      "Headache",
      "Pressure in head",
      "Sensitivity to light",
      "Nausea or vomiting",
    ],
  },
  {
    name: "Anxiety / Mood",
    color: "green",
    symptoms: [
      "Nervous or anxious",
      "Irritability",
      "Sadness",
      "More emotional than usual",
    ],
  },
  {
    name: "Sleep",
    color: "indigo",
    symptoms: ["Drowsiness", "Trouble falling asleep"],
  },
  {
    name: "Other",
    color: "gray",
    symptoms: ["Neck pain", "Don't feel right"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function categoryScore(cat: SymptomCategory, scores: SymptomScores) {
  return cat.symptoms.reduce((sum, s) => sum + (scores[s] ?? 0), 0);
}

export function categoryMax(cat: SymptomCategory) {
  return cat.symptoms.length * 6;
}

// Colors per category for Tailwind (must be full strings for JIT)
export const CATEGORY_STYLES: Record<string, {
  border: string; bg: string; badge: string; bar: string; heading: string;
}> = {
  blue:   { border: "border-blue-200",   bg: "bg-blue-50",   badge: "bg-blue-100 text-blue-700",   bar: "#3b82f6", heading: "text-blue-800"   },
  purple: { border: "border-purple-200", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", bar: "#8b5cf6", heading: "text-purple-800" },
  amber:  { border: "border-amber-200",  bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  bar: "#f59e0b", heading: "text-amber-800"  },
  red:    { border: "border-red-200",    bg: "bg-red-50",    badge: "bg-red-100 text-red-700",      bar: "#ef4444", heading: "text-red-800"    },
  green:  { border: "border-green-200",  bg: "bg-green-50",  badge: "bg-green-100 text-green-700",  bar: "#10b981", heading: "text-green-800"  },
  indigo: { border: "border-indigo-200", bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", bar: "#6366f1", heading: "text-indigo-800" },
  gray:   { border: "border-gray-200",   bg: "bg-gray-50",   badge: "bg-gray-100 text-gray-600",    bar: "#9ca3af", heading: "text-gray-700"   },
};
