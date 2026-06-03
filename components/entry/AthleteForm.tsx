"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { EntryFormValues } from "./types";

interface Props {
  register: UseFormRegister<EntryFormValues>;
  errors: FieldErrors<EntryFormValues>;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none";

export function AthleteForm({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Athlete Name" required error={errors.athleteName?.message}>
          <input {...register("athleteName", { required: "Name is required" })} className={inputCls} placeholder="Full name" />
        </Field>
        <Field label="Date of Birth" required error={errors.dateOfBirth?.message}>
          <input type="date" {...register("dateOfBirth", { required: "Required" })} className={inputCls} />
        </Field>
        <Field label="Sport" required error={errors.sport?.message}>
          <input {...register("sport", { required: "Required" })} className={inputCls} placeholder="e.g. Rugby, Soccer" />
        </Field>
        <Field label="Position / Group" error={errors.position?.message}>
          <input {...register("position")} className={inputCls} placeholder="e.g. Flanker, Midfielder" />
        </Field>
        <Field label="Injury Date" required error={errors.injuryDate?.message}>
          <input type="date" {...register("injuryDate", { required: "Required" })} className={inputCls} />
        </Field>
        <Field label="Evaluation Date" required error={errors.evaluationDate?.message}>
          <input type="date" {...register("evaluationDate", { required: "Required" })} className={inputCls} />
        </Field>
        <Field label="Clinician Name" required error={errors.clinicianName?.message}>
          <input {...register("clinicianName", { required: "Required" })} className={inputCls} placeholder="Dr. Jane Smith" />
        </Field>
      </div>
      <Field label="Clinical Notes" error={errors.notes?.message}>
        <textarea {...register("notes")} rows={3} className={inputCls} placeholder="Optional notes about this evaluation..." />
      </Field>
    </div>
  );
}
