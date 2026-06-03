"use client";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { ExertionalResults } from "@/types";

interface Props { exertional: ExertionalResults; }

export function ExertionalChart({ exertional }: Props) {
  // Flatten all tasks across all stages into a sequence
  const data: { label: string; hr: number; symptoms: number; rpe: number }[] = [];

  for (const stage of exertional.stages) {
    if (stage.tasks.length > 0) {
      for (const task of stage.tasks) {
        data.push({
          label: `S${stage.stageId} ${task.task.split(" ")[0]}`,
          hr: task.heartRate,
          symptoms: task.symptomScore,
          rpe: task.rpe,
        });
      }
    } else {
      data.push({
        label: `S${stage.stageId}`,
        hr: stage.heartRate ?? 0,
        symptoms: stage.symptomScore ?? 0,
        rpe: stage.rpe ?? 0,
      });
    }
  }

  if (data.length === 0) return <p className="text-sm text-gray-400 py-4 text-center">No exertional data recorded.</p>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={40} />
        <YAxis yAxisId="hr" orientation="left" domain={[40, 220]} tick={{ fontSize: 11 }}
          label={{ value: "HR (bpm)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }} />
        <YAxis yAxisId="symp" orientation="right" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11 }}
          label={{ value: "Symptoms (0–10)", angle: 90, position: "insideRight", fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          formatter={(value, name) => [value, name === "hr" ? "Heart Rate (bpm)" : name === "symptoms" ? "Symptom Score" : "RPE"]}
        />
        <Legend formatter={(value) => value === "hr" ? "Heart Rate" : value === "symptoms" ? "Symptoms" : "RPE"} />
        <Bar yAxisId="symp" dataKey="symptoms" fill="#fca5a5" radius={[3, 3, 0, 0]} name="symptoms" />
        <Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="hr" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
