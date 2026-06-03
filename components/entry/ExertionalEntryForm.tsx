"use client";
import { UseFormRegister, useWatch, Control, UseFormWatch, UseFormSetValue, useFieldArray } from "react-hook-form";
import { useRef, useState } from "react";
import { EXERTIONAL_STAGE_DEFS, EXERTIONAL_TASK_NAMES, IMMEDIATE_MEMORY_WORDS, SYMPTOM_LIST, HRDataPoint } from "@/types";
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
  "Symptom provocation", "Volitional fatigue", "Protocol complete", "Physician stopped", "Other",
] as const;

const STAGE_COLORS = [
  "border-blue-200 bg-blue-50", "border-violet-200 bg-violet-50",
  "border-amber-200 bg-amber-50", "border-emerald-200 bg-emerald-50",
];
const STAGE_HEADER_COLORS = [
  "bg-blue-100 text-blue-800", "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800", "bg-emerald-100 text-emerald-800",
];

// What the task-level metric is called per stage
const TASK_METRIC: Record<number, { label: string; field: "reps" | "duration"; placeholder: string }> = {
  1: { label: "Reps",        field: "reps",     placeholder: "e.g. 10" },
  2: { label: "Time (secs)", field: "duration", placeholder: "e.g. 30" },
  3: { label: "Reps",        field: "reps",     placeholder: "e.g. 10" },
};

function parseHRFile(text: string): HRDataPoint[] {
  const lines = text.trim().split(/\r?\n/);
  const points: HRDataPoint[] = [];
  for (const line of lines) {
    const parts = line.split(/[,\t;]/);
    if (parts.length < 2) continue;
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    if (isNaN(a) || isNaN(b)) continue;
    points.push({ time: a, hr: b });
  }
  return points;
}

// ─── Per-task symptom picker ──────────────────────────────────────────────────

function TaskSymptomPicker({
  fieldPrefix,
  register,
  control,
}: {
  fieldPrefix: string;
  register: UseFormRegister<EntryFormValues>;
  control: Control<EntryFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: `${fieldPrefix}.symptoms` as any });
  const provoked = useWatch({ control, name: `${fieldPrefix}.symptomProvoked` as any });

  return (
    <div className="flex items-start gap-2 flex-wrap">
      <select
        {...register(`${fieldPrefix}.symptomProvoked` as any)}
        className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 outline-none w-20 text-center"
      >
        <option value="">—</option>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      {provoked === "yes" && (
        <div className="flex-1 min-w-0 space-y-1.5">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-1.5 flex-wrap">
              <select
                {...register(`${fieldPrefix}.symptoms.${i}.name` as any)}
                className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 outline-none flex-1 min-w-0"
              >
                <option value="">Select symptom…</option>
                {SYMPTOM_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number" min="0"
                  {...register(`${fieldPrefix}.symptoms.${i}.increase` as any)}
                  placeholder="↑"
                  className="w-14 rounded border border-gray-300 px-2 py-1 text-xs text-center focus:border-indigo-500 outline-none"
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">pts ↑</span>
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-base leading-none ml-1">×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: "", increase: "" })}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
            + Add symptom
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function ExertionalEntryForm({ register, control, watch, setValue, onHRFileLoaded, hrFileName }: Props) {
  const imTrials = useWatch({ control, name: "immediateMemory" }) ?? {};
  const t1 = Math.min(12, Math.max(0, Number(imTrials.trial1) || 0));
  const t2 = Math.min(12, Math.max(0, Number(imTrials.trial2) || 0));
  const t3 = Math.min(12, Math.max(0, Number(imTrials.trial3) || 0));
  const imTotal = t1 + t2 + t3;

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
        if (points.length === 0) { setFileError("No valid data found."); return; }
        onHRFileLoaded(points, file.name);
      } catch { setFileError("Could not read file."); }
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
      {EXERTIONAL_STAGE_DEFS.filter((s) => s.hasTasks).map((stageDef, si) => {
        const metric = TASK_METRIC[stageDef.id];
        return (
          <div key={stageDef.id} className={clsx("rounded-xl border-2 overflow-hidden", STAGE_COLORS[si])}>
            <div className={clsx("px-4 py-3 flex items-center gap-2", STAGE_HEADER_COLORS[si])}>
              <span className="text-sm font-bold">Stage {stageDef.id}</span>
              <span className="text-sm font-semibold">{stageDef.name}</span>
            </div>

            {/* Immediate Memory — Stage 1 only */}
            {stageDef.id === 1 && (
              <div className="mx-4 mt-4 rounded-lg border border-blue-200 bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-200">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">Immediate Memory — 3 Trials</h5>
                    <p className="text-xs text-gray-500">Read each word aloud. Score how many the patient recalls per trial.</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                    <p className={clsx("text-2xl font-bold leading-tight", imTotal >= 30 ? "text-emerald-600" : imTotal >= 24 ? "text-amber-600" : imTotal > 0 ? "text-red-600" : "text-gray-300")}>
                      {imTotal}<span className="text-sm font-normal text-gray-400">/36</span>
                    </p>
                  </div>
                </div>
                {/* Two-column body: words left, trials right */}
                <div className="flex gap-0 divide-x divide-blue-100">
                  {/* Word list */}
                  <div className="flex-1 p-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      {IMMEDIATE_MEMORY_WORDS.map((word, i) => (
                        <div key={word} className="flex items-center gap-1.5 py-0.5">
                          <span className="text-xs text-gray-400 w-5 shrink-0 text-right">{i + 1}.</span>
                          <span className="text-sm font-medium text-gray-800">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Trial scores */}
                  <div className="shrink-0 p-3 flex flex-col justify-center gap-3 w-44">
                    {([1, 2, 3] as const).map((trial) => {
                      const val = trial === 1 ? t1 : trial === 2 ? t2 : t3;
                      return (
                        <div key={trial} className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-14 shrink-0">Trial {trial}</label>
                          <input
                            type="number" min="0" max="12"
                            {...register(`immediateMemory.trial${trial}` as const)}
                            placeholder="0"
                            className="w-14 rounded border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <span className="text-xs text-gray-400 shrink-0">/ 12</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-blue-100 pt-2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-14 shrink-0">Total</span>
                      <span className={clsx("text-sm font-bold w-14 text-center", imTotal >= 30 ? "text-emerald-600" : imTotal >= 24 ? "text-amber-600" : imTotal > 0 ? "text-red-600" : "text-gray-300")}>
                        {imTotal}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">/ 36</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COWAT instructions — Stage 3 only */}
            {stageDef.id === 3 && (
              <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Instructions for participant — read aloud before beginning</p>
                <p className="text-sm text-amber-900 leading-relaxed">
                  "In this stage, you will be asked to say as many different words as you can that begin with a specific letter as you complete the squats, lunges, and hip hinges. Do not use proper names (e.g., John, Toronto), numbers, or the same word with different endings (e.g., run, running, runner). Work as quickly as you can, and if you get stuck, keep trying to think of new words until time is up."
                </p>
              </div>
            )}

            {/* Task table */}
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide w-24">Task</th>
                    <th className="text-center py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide w-28">{metric.label}</th>
                    <th className="text-left py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide pl-2">Symptom</th>
                    <th className="text-left py-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wide pl-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {EXERTIONAL_TASK_NAMES.map((task) => (
                    <tr key={task} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="py-2.5 pr-3 font-medium text-gray-700 pt-3">{task}</td>
                      <td className="py-1.5 px-1 pt-2.5">
                        <input
                          type="number" min="0"
                          {...register(`exertionalTasks.${stageDef.id}.${task}.${metric.field}` as const)}
                          placeholder={metric.placeholder}
                          className={inputCls}
                        />
                      </td>
                      <td className="py-1.5 pl-2 pt-2.5">
                        <TaskSymptomPicker
                          fieldPrefix={`exertionalTasks.${stageDef.id}.${task}`}
                          register={register}
                          control={control}
                        />
                      </td>
                      <td className="py-1.5 pl-2 pt-2.5">
                        <input {...register(`exertionalTasks.${stageDef.id}.${task}.notes` as const)}
                          placeholder="optional" className={clsx(inputCls, "text-left")} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* End-of-stage RPE */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  End-of-stage RPE (6–20)
                </label>
                <input
                  type="number" min="6" max="20"
                  {...register(`stageRPE.${stageDef.id}` as const)}
                  placeholder="—"
                  className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Stage 4 */}
      <div className={clsx("rounded-xl border-2 overflow-hidden", STAGE_COLORS[3])}>
        <div className={clsx("px-4 py-3 flex items-center gap-2", STAGE_HEADER_COLORS[3])}>
          <span className="text-sm font-bold">Stage 4</span>
          <span className="text-sm font-semibold">Multi-planar / High Exertion</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Symptom</label>
              <TaskSymptomPicker fieldPrefix="exertionalStage4" register={register} control={control} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Notes</label>
              <input {...register("exertionalStage4.notes")} placeholder="optional" className={clsx(inputCls, "text-left")} />
            </div>
          </div>
          {/* End-of-stage RPE */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              End-of-stage RPE (6–20)
            </label>
            <input type="number" min="6" max="20"
              {...register("exertionalStage4.rpe")}
              placeholder="—"
              className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* HR File Upload */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-0.5">Heart Rate Data File <span className="text-gray-400 font-normal">(optional)</span></h4>
            <p className="text-xs text-gray-500 max-w-sm">Upload a CSV or TXT from a heart rate monitor. Two columns: time (seconds) and heart rate (bpm).</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              {hrFileName ? "Replace file" : "Upload file"}
            </button>
            {hrFileName && <span className="text-xs text-emerald-600 font-medium">✓ {hrFileName}</span>}
          </div>
        </div>
        {fileError && <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{fileError}</p>}
        <input ref={fileInputRef} type="file" accept=".csv,.txt,.tsv" className="sr-only" onChange={handleFileChange} />
      </div>

      {/* Overall notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Testing Notes</label>
        <textarea {...register("exertionalNotes")} rows={2} placeholder="Any additional observations..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
        <strong>RPE scale:</strong> 6 = No exertion · 13 = Somewhat hard · 17 = Very hard · 20 = Maximum exertion. Recorded once at the end of each stage.
      </div>
    </div>
  );
}
