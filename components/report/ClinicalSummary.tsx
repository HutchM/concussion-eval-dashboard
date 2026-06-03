import type { Evaluation } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { InsightBox } from "@/components/ui/InsightBox";
import { generateClinicalInsights } from "@/lib/insights";

interface Props { evaluation: Evaluation; }

export function ClinicalSummary({ evaluation }: Props) {
  const insights = generateClinicalInsights(evaluation);
  const flags = insights.filter((i) => i.level === "flag");
  const cautions = insights.filter((i) => i.level === "caution");
  const infos = insights.filter((i) => i.level === "info");

  return (
    <Card className="mb-6">
      <CardHeader
        title="Clinical Summary"
        subtitle="Auto-generated findings to support clinical interpretation"
      />
      <div className="space-y-2">
        {flags.map((i, idx) => <InsightBox key={`f${idx}`} insight={i} />)}
        {cautions.map((i, idx) => <InsightBox key={`c${idx}`} insight={i} />)}
        {infos.map((i, idx) => <InsightBox key={`i${idx}`} insight={i} />)}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 leading-relaxed">
          This dashboard is intended to support clinical interpretation and patient communication. It does not provide a medical diagnosis or replace individualized clinical judgment.
        </p>
      </div>
    </Card>
  );
}
