"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { HRDataPoint } from "@/types";

interface Props {
  data: HRDataPoint[];
  fileName?: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function HRFileChart({ data, fileName }: Props) {
  if (!data || data.length === 0) return null;

  const maxHR = Math.max(...data.map((d) => d.hr));
  const minHR = Math.min(...data.map((d) => d.hr));
  const avgHR = Math.round(data.reduce((s, d) => s + d.hr, 0) / data.length);

  return (
    <div>
      {/* Summary stats */}
      <div className="flex gap-6 mb-4 flex-wrap">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Peak HR</p>
          <p className="text-xl font-bold text-indigo-600">{maxHR} <span className="text-sm font-normal text-gray-400">bpm</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Avg HR</p>
          <p className="text-xl font-bold text-gray-800">{avgHR} <span className="text-sm font-normal text-gray-400">bpm</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Min HR</p>
          <p className="text-xl font-bold text-gray-800">{minHR} <span className="text-sm font-normal text-gray-400">bpm</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
          <p className="text-xl font-bold text-gray-800">{formatTime(data[data.length - 1].time)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            tick={{ fontSize: 10 }}
            label={{ value: "Time (mm:ss)", position: "insideBottom", offset: -2, fontSize: 11, fill: "#9ca3af" }}
            height={30}
          />
          <YAxis
            domain={[Math.max(40, minHR - 10), maxHR + 10]}
            tick={{ fontSize: 11 }}
            label={{ value: "HR (bpm)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }}
          />
          <Tooltip
            formatter={(value) => [`${value} bpm`, "Heart Rate"]}
            labelFormatter={(val) => `Time: ${formatTime(Number(val))}`}
          />
          <ReferenceLine y={avgHR} stroke="#94a3b8" strokeDasharray="4 4"
            label={{ value: `Avg ${avgHR}`, position: "insideTopRight", fontSize: 10, fill: "#94a3b8" }} />
          <Line
            type="monotone"
            dataKey="hr"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            isAnimationActive={data.length < 500}
          />
        </LineChart>
      </ResponsiveContainer>

      {fileName && (
        <p className="text-xs text-gray-400 mt-2 text-right">Source: {fileName} · {data.length.toLocaleString()} data points</p>
      )}
    </div>
  );
}
