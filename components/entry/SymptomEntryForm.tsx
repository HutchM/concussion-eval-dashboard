"use client";
import { UseFormRegister, useWatch, Control } from "react-hook-form";
import { SYMPTOM_LIST } from "@/types";
import type { EntryFormValues } from "./types";
import { clsx } from "clsx";

interface Props {
  register: UseFormRegister<EntryFormValues>;
  control: Control<EntryFormValues>;
  percentageOfNormal?: number;
}

const RATING_LABELS = ["0\nNone", "1\nVery mild", "2\nMild", "3\nModerate", "4\nMod-severe", "5\nSevere", "6\nMax"];

function RatingButton({ value, current, onClick }: { value: number; current: number; onClick: () => void }) {
  const color =
    value === 0 ? "bg-gray-100 text-gray-500" :
    value <= 2  ? "bg-amber-100 text-amber-700" :
    value <= 4  ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700";
  const active =
    value === 0 ? "ring-2 ring-gray-400 bg-gray-200" :
    value <= 2  ? "ring-2 ring-amber-400 bg-amber-200" :
    value <= 4  ? "ring-2 ring-orange-400 bg-orange-200" :
                  "ring-2 ring-red-400 bg-red-200";
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "w-8 h-8 rounded-md text-xs font-semibold transition-all flex items-center justify-center",
        current === value ? active : color
      )}
    >
      {value}
    </button>
  );
}

export function SymptomEntryForm({ register, control }: Props) {
  const symptomValues = useWatch({ control, name: "symptoms" }) ?? {};
  const percentVal = useWatch({ control, name: "percentageOfNormal" });
  const total = Object.values(symptomValues).reduce((s: number, v) => s + (Number(v) || 0), 0);
  const count = Object.values(symptomValues).filter((v) => Number(v) > 0).length;
  const pct = Number(percentVal);

  return (
    <div>
      {/* Percentage of normal question */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          If 100% is perfectly normal, what percentage of normal do you feel right now?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            {...register("percentageOfNormal")}
            className="flex-1 accent-indigo-600"
          />
          <span className={`text-2xl font-bold w-16 text-right ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
            {pct || 0}%
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
          <span>0% — Not normal at all</span>
          <span>100% — Completely normal</span>
        </div>
      </div>

      {/* Totals bar */}
      <div className="flex gap-6 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Symptoms reported</p>
          <p className="text-2xl font-bold text-gray-800">{count}<span className="text-sm font-normal text-gray-400">/22</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total severity score</p>
          <p className="text-2xl font-bold text-gray-800">{total}<span className="text-sm font-normal text-gray-400">/132</span></p>
        </div>
      </div>

      {/* Rating key */}
      <div className="flex items-center gap-2 mb-4 flex-wrap text-xs text-gray-400">
        <span>Rating key:</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded">0 = None</span>
        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">1–2 = Mild</span>
        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">3–4 = Moderate</span>
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">5–6 = Severe</span>
      </div>

      <div className="space-y-2">
        {SYMPTOM_LIST.map((symptom) => {
          const currentValue = Number(symptomValues[symptom] ?? 0);
          return (
            <div key={symptom} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700 flex-1 min-w-0">{symptom}</span>
              <div className="flex gap-1 shrink-0">
                {[0, 1, 2, 3, 4, 5, 6].map((v) => (
                  <div key={v} className="relative">
                    <input
                      type="radio"
                      {...register(`symptoms.${symptom}` as const)}
                      value={v}
                      className="sr-only"
                    />
                    <RatingButton
                      value={v}
                      current={currentValue}
                      onClick={() => {
                        // handled by native radio — but we need a controlled click
                        const el = document.querySelector<HTMLInputElement>(
                          `input[name="symptoms.${symptom}"][value="${v}"]`
                        );
                        if (el) el.click();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
