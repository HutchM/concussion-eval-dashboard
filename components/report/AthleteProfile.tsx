import type { Athlete } from "@/types";
import { Card } from "@/components/ui/Card";

interface Props { athlete: Athlete; }

export function AthleteProfile({ athlete }: Props) {
  const age = new Date().getFullYear() - new Date(athlete.dateOfBirth).getFullYear();

  return (
    <Card className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl shrink-0">
          👤
        </div>
        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{athlete.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {athlete.sport}{athlete.position ? ` · ${athlete.position}` : ""} · Age {age}
          </p>
        </div>
        {/* Key dates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-right sm:text-left shrink-0">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Injury Date</p>
            <p className="font-medium text-gray-800">{new Date(athlete.injuryDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Evaluated</p>
            <p className="font-medium text-gray-800">{new Date(athlete.evaluationDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Days Post-Injury</p>
            <p className="font-bold text-indigo-600 text-lg">{athlete.daysSinceInjury}</p>
          </div>
        </div>
      </div>
      {athlete.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Clinical Notes</p>
          <p className="text-sm text-gray-700">{athlete.notes}</p>
        </div>
      )}
    </Card>
  );
}
