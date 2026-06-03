"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { SymptomResults } from "@/types";

interface Props { symptoms: SymptomResults; }

const SYMPTOM_GROUPS = [
  {
    label: "Head",
    keys: ["Headache", "Pressure in head"] as const,
  },
  {
    label: "Vestibular",
    keys: ["Dizziness", "Balance problems", "Blurred vision", "Nausea or vomiting"] as const,
  },
  {
    label: "Sensory",
    keys: ["Sensitivity to light", "Sensitivity to noise"] as const,
  },
  {
    label: "Cognitive",
    keys: ["Feeling slowed down", "Feeling like in a fog", "Don't feel right", "Difficulty concentrating", "Difficulty remembering", "Confusion"] as const,
  },
  {
    label: "Energy",
    keys: ["Fatigue or low energy", "Drowsiness", "Trouble falling asleep"] as const,
  },
  {
    label: "Emotional",
    keys: ["More emotional than usual", "Irritability", "Sadness", "Nervous or anxious"] as const,
  },
  {
    label: "Physical",
    keys: ["Neck pain"] as const,
  },
];

function getColor(value: number) {
  if (value === 0) return "#e5e7eb";
  if (value <= 2) return "#fbbf24";
  if (value <= 4) return "#f97316";
  return "#ef4444";
}

export function SymptomBarChart({ symptoms }: Props) {
  const data = Object.entries(symptoms.scores).map(([name, value]) => ({
    name: name.length > 22 ? name.substring(0, 20) + "…" : name,
    fullName: name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 140 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
        <Tooltip
          formatter={(value, _, props) => [
            `${value}/6`,
            (props as { payload?: { fullName?: string } })?.payload?.fullName ?? "",
          ]}
        />
        <Bar dataKey="value" radius={[0, 3, 3, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
