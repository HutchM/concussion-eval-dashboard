"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEvaluationStore } from "@/store/evaluationStore";
import { Card, CardHeader } from "@/components/ui/Card";
import { severityBadge, flagBadge, toleranceBadge } from "@/components/ui/Badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { SYMPTOM_CATEGORIES, categoryScore, categoryMax, CATEGORY_STYLES } from "@/lib/symptomCategories";

export default function AthleteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAthleteEvaluations, getUniqueAthletes } = useEvaluationStore();

  const athlete = getUniqueAthletes().find((a) => a.id === params.id);
  const evals = getAthleteEvaluations(params.id as string);

  if (!athlete || evals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Athlete not found.</p>
        <button onClick={() => router.push("/athletes")} className="text-indigo-600 underline text-sm">Back to Users</button>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(athlete.dateOfBirth).getFullYear();

  // Build trend data — overall + per-category (as % of max for comparability)
  const trendData = evals.map((e, i) => {
    const categoryData: Record<string, number> = {};
    for (const cat of SYMPTOM_CATEGORIES) {
      const score = categoryScore(cat, e.symptoms.scores);
      const max = categoryMax(cat);
      categoryData[cat.name] = max > 0 ? Math.round((score / max) * 100) : 0;
    }
    return {
      label: i === 0 ? "Baseline" : `FU ${i}`,
      date: new Date(e.completedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
      daysPi: e.athlete.daysSinceInjury,
      symptomScore: e.symptoms.totalSeverity,
      pctNormal: e.symptoms.percentageOfNormal,
      evalId: e.id,
      ...categoryData,
    };
  });

  return (
    <div>
      {/* Back */}
      <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
        ← Back
      </button>

      {/* Athlete header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl shrink-0">👤</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
            <p className="text-sm text-gray-500">{athlete.sport}{athlete.position ? ` · ${athlete.position}` : ""} · Age {age}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Injury: {new Date(athlete.injuryDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} ·
              {" "}{evals.length} evaluation{evals.length !== 1 ? "s" : ""} on record
            </p>
          </div>
        </div>
        <Link
          href={`/enter?athleteId=${athlete.id}`}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          + New Follow-up
        </Link>
      </div>

      {/* Trend chart */}
      {evals.length > 1 && (
        <Card className="mb-6">
          <CardHeader title="Recovery Trends" subtitle="Key metrics across all evaluations" />
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="score" orientation="left" domain={[0, 132]} tick={{ fontSize: 11 }}
                label={{ value: "Symptom score", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af" }} />
              <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }}
                label={{ value: "% Normal", angle: 90, position: "insideRight", fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                labelFormatter={(label, payload) => {
                  const p = (payload as unknown as Array<{ payload?: { date?: string; daysPi?: number } }>)?.[0]?.payload;
                  return p ? `${label} — ${p.date} (Day ${p.daysPi})` : label;
                }}
              />
              <Legend />
              <Line yAxisId="score" type="monotone" dataKey="symptomScore" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} name="Symptom score" />
              <Line yAxisId="pct" type="monotone" dataKey="pctNormal" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} name="% Feeling normal" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Symptom domain trends */}
      {evals.length > 1 && (
        <Card className="mb-6">
          <CardHeader
            title="Symptom Domain Trends"
            subtitle="Score as % of domain maximum across evaluations"
          />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }}
                label={{ value: "% of max", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                labelFormatter={(label, payload) => {
                  const p = (payload as unknown as Array<{ payload?: { date?: string; daysPi?: number } }>)?.[0]?.payload;
                  return p ? `${label} — ${p.date} (Day ${p.daysPi})` : label;
                }}
              />
              <Legend />
              {SYMPTOM_CATEGORIES.filter((c) => c.name !== "Other").map((cat) => (
                <Line
                  key={cat.name}
                  type="monotone"
                  dataKey={cat.name}
                  stroke={CATEGORY_STYLES[cat.color].bar}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={cat.name}
                />
              ))}
              {/* % Feeling normal overlay */}
              <Line
                type="monotone"
                dataKey="pctNormal"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 4 }}
                name="% Feeling normal"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 px-2 pb-2">
            Each domain score is shown as a percentage of its maximum possible score, so all domains are directly comparable on the same axis.
          </p>
        </Card>
      )}

      {/* Evaluation timeline */}
      <Card padding={false}>
        <div className="p-6 pb-3">
          <CardHeader title="Evaluation History" subtitle="All assessments in chronological order" />
        </div>
        <div className="space-y-0 divide-y divide-gray-100">
          {evals.map((e, i) => (
            <div key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              {/* Number / label */}
              <div className="shrink-0 w-20 text-center">
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2 py-1">
                  {i === 0 ? "Baseline" : `Follow-up ${i}`}
                </p>
              </div>
              {/* Date + days */}
              <div className="shrink-0 w-32">
                <p className="text-sm font-medium text-gray-800">
                  {new Date(e.completedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-xs text-gray-400">Day {e.athlete.daysSinceInjury} post-injury</p>
              </div>
              {/* Scores */}
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                {severityBadge(e.symptoms.severityCategory)}
                {flagBadge(e.voms.overallFlag)}
                {toleranceBadge(e.exertional.exertionalTolerance)}
                {e.symptoms.percentageOfNormal !== undefined && (
                  <span className="text-xs text-gray-500">
                    Feels {e.symptoms.percentageOfNormal}% normal
                  </span>
                )}
              </div>
              {/* Symptom score */}
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400">Sx score</p>
                <p className="font-bold text-gray-800">{e.symptoms.totalSeverity}<span className="text-xs font-normal text-gray-400">/132</span></p>
              </div>
              {/* Link */}
              <Link href={`/report/${e.id}`} className="shrink-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View →
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
