"use client";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import type { ExertionalResults } from "@/types";

interface Props { exertional: ExertionalResults; }

export function ExertionalChart({ exertional }: Props) {
  const data = exertional.stages.map((s) => ({
    stage: `S${s.stage}`,
    "Heart Rate": s.heartRate,
    "Symptom Score": s.symptomScore,
    "RPE": s.rpe,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="hr" orientation="left" domain={[40, 200]} tick={{ fontSize: 11 }} label={{ value: "HR (bpm)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }} />
        <YAxis yAxisId="symp" orientation="right" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11 }} label={{ value: "Symptoms (0–10)", angle: 90, position: "insideRight", fontSize: 11, fill: "#6b7280" }} />
        <Tooltip />
        <Legend />
        {exertional.symptomThresholdHR && (
          <ReferenceLine
            yAxisId="hr"
            y={exertional.symptomThresholdHR}
            stroke="#f97316"
            strokeDasharray="4 4"
            label={{ value: "Sx threshold", position: "insideTopLeft", fontSize: 10, fill: "#f97316" }}
          />
        )}
        <Bar yAxisId="symp" dataKey="Symptom Score" fill="#fca5a5" radius={[3, 3, 0, 0]} />
        <Line yAxisId="hr" type="monotone" dataKey="Heart Rate" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
