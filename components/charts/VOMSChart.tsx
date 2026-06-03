"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import type { VOMSResults } from "@/types";

interface Props { voms: VOMSResults; }

export function VOMSChart({ voms }: Props) {
  // Show total change score per test (sum of all 4 symptom changes)
  const data = voms.tests.map((t) => {
    const totalChange =
      t.changeScores.headache +
      t.changeScores.dizziness +
      t.changeScores.nausea +
      t.changeScores.fogginess;
    return {
      name: t.test === "Near Point of Convergence" ? "NPC" :
            t.test === "Visual Motion Sensitivity" ? "VMS" :
            t.test === "Horizontal VOR" ? "H-VOR" :
            t.test === "Vertical VOR" ? "V-VOR" :
            t.test === "Horizontal Saccades" ? "H-Sacc" :
            t.test === "Vertical Saccades" ? "V-Sacc" :
            t.test,
      fullName: t.test,
      headache:  t.changeScores.headache,
      dizziness: t.changeScores.dizziness,
      nausea:    t.changeScores.nausea,
      fogginess: t.changeScores.fogginess,
      totalChange,
      provoked: t.provoked,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: "Δ Change", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          labelFormatter={(label, payload) => {
            const p = payload as unknown as Array<{ payload?: { fullName?: string } }>;
            return p?.[0]?.payload?.fullName ?? label;
          }}
          formatter={(value, name) => [`+${value}`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
        />
        <Legend formatter={(value) => String(value).charAt(0).toUpperCase() + String(value).slice(1)} />
        <ReferenceLine y={2} stroke="#f97316" strokeDasharray="4 4" label={{ value: "Threshold", position: "insideTopRight", fontSize: 10, fill: "#f97316" }} />
        <Bar dataKey="headache"  stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
        <Bar dataKey="dizziness" stackId="a" fill="#8b5cf6" />
        <Bar dataKey="nausea"    stackId="a" fill="#a78bfa" />
        <Bar dataKey="fogginess" stackId="a" fill="#c4b5fd" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
