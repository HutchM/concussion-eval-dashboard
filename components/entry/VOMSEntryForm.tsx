"use client";
import { UseFormRegister, useWatch, Control, UseFormSetValue } from "react-hook-form";
import { VOMS_TESTS } from "@/types";
import type { EntryFormValues } from "./types";
import { clsx } from "clsx";

interface Props {
  register: UseFormRegister<EntryFormValues>;
  control: Control<EntryFormValues>;
  setValue: UseFormSetValue<EntryFormValues>;
}

const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none";

export function VOMSEntryForm({ register, control, setValue }: Props) {
  const vomsValues = useWatch({ control, name: "voms" }) ?? {};

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium pb-2 border-b border-gray-100">
        <div className="col-span-4">Test</div>
        <div className="col-span-2 text-center">Baseline (0–10)</div>
        <div className="col-span-2 text-center">Post-test (0–10)</div>
        <div className="col-span-2 text-center">Change</div>
        <div className="col-span-2 text-center">Provoked?</div>
      </div>

      {VOMS_TESTS.map((test) => {
        const isNPC = test === "Near Point of Convergence";
        const baseline = Number(vomsValues?.[test]?.baseline ?? 0);
        const post = Number(vomsValues?.[test]?.post ?? 0);
        const change = post - baseline;
        const npcDist = Number(vomsValues?.[test]?.npcDistance ?? 0);
        const provoked = isNPC ? npcDist > 5 : change >= 2;

        return (
          <div key={test} className={clsx("grid grid-cols-12 gap-2 items-center py-2.5 border-b border-gray-50 last:border-0 rounded-lg px-1", provoked && "bg-red-50")}>
            <div className="col-span-4">
              <p className="text-sm font-medium text-gray-800">{test}</p>
              {isNPC && (
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    {...register(`voms.${test}.npcDistance` as const)}
                    placeholder="NPC dist (cm)"
                    className={clsx(inputCls, "text-xs py-1")}
                  />
                </div>
              )}
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min="0"
                max="10"
                {...register(`voms.${test}.baseline` as const)}
                placeholder="0"
                className={clsx(inputCls, "text-center")}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min="0"
                max="10"
                {...register(`voms.${test}.post` as const)}
                placeholder="0"
                className={clsx(inputCls, "text-center")}
              />
            </div>
            <div className="col-span-2 text-center">
              <span className={clsx("text-sm font-semibold", change >= 2 ? "text-red-600" : "text-gray-600")}>
                {change >= 0 ? "+" : ""}{change}
              </span>
            </div>
            <div className="col-span-2 text-center">
              {provoked ? (
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">🚩 Yes</span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ No</span>
              )}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-400 mt-2">
        A change score ≥ 2 points (or NPC &gt; 5 cm) indicates clinically relevant symptom provocation.
      </p>
    </div>
  );
}
