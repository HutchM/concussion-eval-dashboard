"use client";
import { UseFormRegister, useFieldArray, Control, UseFormWatch } from "react-hook-form";
import type { EntryFormValues } from "./types";
import { clsx } from "clsx";

interface Props {
  register: UseFormRegister<EntryFormValues>;
  control: Control<EntryFormValues>;
  watch: UseFormWatch<EntryFormValues>;
}

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-center";

const STOP_REASONS = [
  "Symptom provocation",
  "Volitional fatigue",
  "Protocol complete",
  "Physician stopped",
  "Other",
] as const;

export function ExertionalEntryForm({ register, control, watch }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "stages" });

  return (
    <div className="space-y-4">
      {/* Resting HR + stop reason */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resting HR (bpm) *</label>
          <input
            type="number"
            {...register("restingHeartRate", { required: true })}
            placeholder="e.g. 65"
            className={clsx(inputCls, "text-left")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stop Reason *</label>
          <select {...register("stopReason", { required: true })} className={clsx(inputCls, "text-left")}>
            {STOP_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stage table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-gray-50 rounded-lg">
              {["#", "Speed (km/h)", "Incline (%)", "Duration (min)", "HR (bpm)", "RPE (6–20)", "Symptoms (0–10)", "Notes", ""].map((h) => (
                <th key={h} className="py-2 px-2 text-center text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="border-b border-gray-50">
                <td className="py-1.5 px-1 text-center text-sm font-semibold text-gray-600">{index + 1}</td>
                <td className="py-1.5 px-1"><input type="number" step="0.1" {...register(`stages.${index}.speed`)} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input type="number" step="1" {...register(`stages.${index}.incline`)} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input type="number" step="0.5" {...register(`stages.${index}.duration`)} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input type="number" {...register(`stages.${index}.heartRate`, { required: true })} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input type="number" min="6" max="20" {...register(`stages.${index}.rpe`, { required: true })} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input type="number" min="0" max="10" {...register(`stages.${index}.symptomScore`, { required: true })} placeholder="—" className={inputCls} /></td>
                <td className="py-1.5 px-1"><input {...register(`stages.${index}.notes`)} placeholder="optional" className={inputCls} /></td>
                <td className="py-1.5 px-1">
                  <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => append({ stage: fields.length + 1, speed: "", incline: "", duration: "", heartRate: "", rpe: "", symptomScore: "", notes: "" })}
        className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
      >
        + Add stage
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Exertional Testing Notes</label>
        <textarea
          {...register("exertionalNotes")}
          rows={2}
          placeholder="Any additional observations during testing..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
        <strong>RPE scale:</strong> 6 = No exertion, 13 = Somewhat hard, 17 = Very hard, 20 = Maximum exertion.<br />
        <strong>Symptom score:</strong> 0 = No symptoms, 10 = Maximum symptoms.
      </div>
    </div>
  );
}
