"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import type { VOMSResults } from "@/types";

interface Props { voms: VOMSResults; }

export function VOMSChart({ voms }: Props) {
  const data = voms.tests.map((t) => ({
    name: t.test === "Near Point of Convergence" ? "NPC" :
          t.test === "Visual Motion Sensitivity" ? "VMS" :
          t.test === "Horizontal VOR" ? "H-VOR" :
          t.test === "Vertical VOR" ? "V-VOR" :
          t.test === "Horizontal Saccades" ? "H-Sacc" :
          t.test === "Vertical Saccades" ? "V-Sacc" :
          t.test,
    fullName: t.test,
    baseline: t.baselineSymptoms,
    post: t.postSymptoms,
    change: t.changeScore,
    provoked: t.provoked,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value, name) => [`${value}/10`, name === "baseline" ? "Baseline" : "Post-Test"]}
          labelFormatter={(label, payload) => {
            const p = payload as unknown as Array<{ payload?: { fullName?: string } }>;
            return p?.[0]?.payload?.fullName ?? label;
          }}
        />
        <Legend formatter={(value) => value === "baseline" ? "Baseline symptoms" : "Post-test symptoms"} />
        <ReferenceLine y={2} stroke="#f97316" strokeDasharray="4 4" label={{ value: "Threshold (+2)", position: "insideTopRight", fontSize: 10, fill: "#f97316" }} />
        <Bar dataKey="baseline" fill="#93c5fd" radius={[3, 3, 0, 0]} />
        <Bar dataKey="post" radius={[3, 3, 0, 0]}
          fill="#6366f1"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
