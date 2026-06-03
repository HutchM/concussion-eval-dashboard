"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { ExertionalResults } from "@/types";

interface Props { exertional: ExertionalResults; }

function symptomFill(score: number) {
  if (score >= 6) return "#ef4444";
  if (score >= 3) return "#f97316";
  if (score >= 1) return "#fbbf24";
  return "#d1fae5";
}

export function ExertionalChart({ exertional }: Props) {
  const data: { label: string; symptoms: number }[] = [];

  for (const stage of exertional.stages) {
    if (stage.tasks.length > 0) {
      for (const task of stage.tasks) {
        data.push({
          label: `S${stage.stageId} ${task.task.split(" ")[0]}`,
          symptoms: task.symptomScore,
        });
      }
    } else {
      data.push({
        label: `S${stage.stageId}`,
        symptoms: stage.symptomScore ?? 0,
      });
    }
  }

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No exertional data recorded.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} interval={0} />
        <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11 }}
          label={{ value: "Symptom Score (0–10)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }} />
        <Tooltip formatter={(value) => [`${value}/10`, "Symptom Score"]} />
        <ReferenceLine y={0} stroke="#e5e7eb" />
        <Bar dataKey="symptoms" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={symptomFill(entry.symptoms)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
