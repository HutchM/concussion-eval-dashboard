"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ExertionalResults } from "@/types";

interface Props { exertional: ExertionalResults; }

export function ExertionalChart({ exertional }: Props) {
  const data: { label: string; value: number; provoked: boolean }[] = [];

  for (const stage of exertional.stages) {
    if (stage.tasks.length > 0) {
      for (const task of stage.tasks) {
        const totalIncrease = task.symptomDetails.reduce((s, d) => s + d.increase, 0);
        data.push({
          label: `S${stage.stageId} ${task.task.split(" ")[0]}`,
          value: task.symptomProvoked ? Math.max(1, totalIncrease) : 0,
          provoked: task.symptomProvoked,
        });
      }
    } else {
      const totalIncrease = (stage.symptomDetails ?? []).reduce((s, d) => s + d.increase, 0);
      data.push({
        label: `S${stage.stageId}`,
        value: stage.symptomProvoked ? Math.max(1, totalIncrease) : 0,
        provoked: stage.symptomProvoked ?? false,
      });
    }
  }

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No exertional data recorded.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} interval={0} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: "Symptom increase", angle: -90, position: "insideLeft", fontSize: 10, fill: "#6b7280" }} />
        <Tooltip formatter={(value, _, props) => [
          props.payload?.provoked ? `Yes (total ↑${value})` : "No",
          "Symptom provoked",
        ]} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.provoked ? "#f97316" : "#d1fae5"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
