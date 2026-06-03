import type { Evaluation } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { generatePatientInsights } from "@/lib/insights";

interface Props { evaluation: Evaluation; }

export function PatientSummary({ evaluation }: Props) {
  const insights = generatePatientInsights(evaluation);
  const name = evaluation.athlete.name.split(" ")[0];

  return (
    <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader
        title={`${name}'s Plain-Language Summary`}
        subtitle="A simple overview of today's assessment — written for the athlete"
      />

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{insight.emoji}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{insight.domain}</p>
                <p className="font-semibold text-gray-900 mb-1">{insight.headline}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{insight.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next steps reminder */}
      <div className="mt-5 rounded-xl bg-white border border-indigo-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-2">What to discuss with your clinician</p>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>• How your symptoms have changed since the injury</li>
          <li>• Your sleep, concentration, and school or work performance</li>
          <li>• When it's safe to return to physical activity and sport</li>
          <li>• Any areas of concern highlighted in today's assessment</li>
        </ul>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        This summary is for informational purposes only. Always discuss your results with your clinician before making any decisions about returning to sport or daily activities.
      </p>
    </Card>
  );
}
