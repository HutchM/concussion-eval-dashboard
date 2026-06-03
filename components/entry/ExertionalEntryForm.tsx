"use client";
import { UseFormRegister, useWatch, Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { useRef, useState } from "react";
import { EXERTIONAL_STAGE_DEFS, EXERTIONAL_TASK_NAMES, HRDataPoint } from "@/types";
import type { EntryFormValues } from "./types";
import { clsx } from "clsx";

interface Props {
  register: UseFormRegister<EntryFormValues>;
  control: Control<EntryFormValues>;
  watch: UseFormWatch<EntryFormValues>;
  setValue: UseFormSetValue<EntryFormValues>;
  onHRFileLoaded: (data: HRDataPoint[], fileName: string) => void;
  hrFileName?: string;
}

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-center";

const STOP_REASONS = [
  "Symptom provocation",
  "Volitional fatigue",
  "Protocol complete",
  "Physician stopped",
  "Other",
] as const;

const STAGE_COLORS = [
  "border-blue-200 bg-blue-50",
  "border-violet-200 bg-violet-50",
  "border-amber-200 bg-amber-50",
  "border-emerald-200 bg-emerald-50",
];

const STAGE_HEADER_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
];

function symptomColor(val: string) {
  const n = Number(val);
  if (!val || n === 0) return "";
  if (n <= 3) return "border-amber-400 bg-amber-50";
  return "border-red-400 bg-red-50";
}

// Parse an uploaded HR CSV file into HRDataPoint[]
// Accepts formats: "time,hr" or "Time,Heart Rate" or just two numeric columns
function parseHRFile(text: string): HRDataPoint[] {
  const lines = text.trim().split(/\r?\n/);
  const points: HRDataPoint[] = [];
  for (const line of lines) {
    const parts = line.split(/[,\t;]/);
    if (parts.length < 2) continue;
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    if (isNaN(a) || isNaN(b)) continue; // skip header rows
    points.push({ time: a, hr: b });
  }
  return points;
}

export function ExertionalEntryForm({ register, control, watch, setValue, onHRFileLoaded, hrFileName }: Props) {
  const tasks = useWatch({ control, name: "exertionalTasks" }) ?? {};
  const stage4 = useWatch({ control, name: "exertionalStage4" }) ?? {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const points = parseHRFile(text);
        if (points.length === 0) {
          setFileError("No valid data found. Ensure the file has two columns: time and heart rate.");
          return;
        }
        onHRFileLoaded(points, file.name);
      } catch {
        setFileError("Could not read file. Please check the format.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      {/* Stop reason */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stop Reason *</label>
          <select {...register("stopReason", { required: true })} className={clsx(inputCls, "text-left")}>
            {STOP_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Stages 1–3 */}
      {EXERTIONAL_STAGE_DEFS.filter((s) => s.hasTasks).map((stageDef, si) => (
        <div key={stageDef.id} className={clsx("rounded-xl border-2 overflow-hidden", STAGE_COLORS[si])}>
          <div className={clsx("px-4 py-3 flex items-center gap-2", STAGE_HEADER_COLORS[si])}>
            <span className="text-sm font-bold">Stage {stageDef.id}</span>
            <span className="text-sm font-semibold">{stageDef.name}</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide w-28">Task</th>
                  <th className="text-center py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide">RPE (6–20)</th>
                  <th className="text-center py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide">Symptoms (0–10)</th>
                  <th className="text-left py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide pl-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {EXERTIONAL_TASK_NAMES.map((task) => {
                  const symp = tasks?.[stageDef.id]?.[task]?.symptomScore ?? "";
                  return (
                    <tr key={task} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-3 font-medium text-gray-700">{task}</td>
                      <td className="py-1.5 px-1">
                        <input type="number" min="6" max="20"
                          {...register(`exertionalTasks.${stageDef.id}.${task}.rpe` as const)}
                          placeholder="—" className={inputCls} />
                      </td>
                      <td className="py-1.5 px-1">
                        <input type="number" min="0" max="10"
                          {...register(`exertionalTasks.${stageDef.id}.${task}.symptomScore` as const)}
                          placeholder="—" className={clsx(inputCls, symptomColor(String(symp)))} />
                      </td>
                      <td className="py-1.5 pl-2">
                        <input {...register(`exertionalTasks.${stageDef.id}.${task}.notes` as const)}
                          placeholder="optional" className={clsx(inputCls, "text-left")} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Stage 4 */}
      <div className={clsx("rounded-xl border-2 overflow-hidden", STAGE_COLORS[3])}>
        <div className={clsx("px-4 py-3 flex items-center gap-2", STAGE_HEADER_COLORS[3])}>
          <span className="text-sm font-bold">Stage 4</span>
          <span className="text-sm font-semibold">Multi-planar / High Exertion</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">RPE (6–20)</label>
              <input type="number" min="6" max="20"
                {...register("exertionalStage4.rpe")} placeholder="—" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Symptoms (0–10)</label>
              <input type="number" min="0" max="10"
                {...register("exertionalStage4.symptomScore")}
                placeholder="—"
                className={clsx(inputCls, symptomColor(String(stage4?.symptomScore ?? "")))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Notes</label>
              <input {...register("exertionalStage4.notes")} placeholder="optional" className={clsx(inputCls, "text-left")} />
            </div>
          </div>
        </div>
      </div>

      {/* HR File Upload */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-0.5">Heart Rate Data File <span className="text-gray-400 font-normal">(optional)</span></h4>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Upload a CSV or TXT file exported from a heart rate monitor or wearable. Expected format: two columns — <strong>time (seconds)</strong> and <strong>heart rate (bpm)</strong>, with or without a header row.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {hrFileName ? "Replace file" : "Upload file"}
            </button>
            {hrFileName && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                ✓ {hrFileName}
              </span>
            )}
          </div>
        </div>

        {fileError && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{fileError}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.tsv"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Testing Notes</label>
        <textarea {...register("exertionalNotes")} rows={2}
          placeholder="Any additional observations..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
        <strong>RPE scale:</strong> 6 = No exertion · 13 = Somewhat hard · 17 = Very hard · 20 = Maximum.<br />
        <strong>Symptom score:</strong> 0 = No symptoms · 10 = Maximum. Cells turn amber/red as scores are entered.
      </div>
    </div>
  );
}
