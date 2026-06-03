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

const SYMPTOM_COLS = [
  { key: "headache",  label: "Headache" },
  { key: "dizziness", label: "Dizziness" },
  { key: "nausea",    label: "Nausea" },
  { key: "fogginess", label: "Fogginess" },
] as const;

const inputCls = "w-full rounded border border-gray-300 px-1 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-center";

function changeColor(change: number) {
  if (change >= 2) return "text-red-600 font-bold";
  if (change > 0)  return "text-amber-500 font-medium";
  return "text-gray-400";
}

export function VOMSEntryForm({ register, control, setValue }: Props) {
  const vomsValues = useWatch({ control, name: "voms" }) ?? {};

  return (
    <div className="space-y-6">
      {VOMS_TESTS.map((test) => {
        const isNPC = test === "Near Point of Convergence";
        const entry = vomsValues?.[test] ?? {};
        const npcDist = Number(entry?.npcDistance ?? 0);

        // Check provocation per symptom
        const changes = SYMPTOM_COLS.map(({ key }) => {
          const pre  = Number(entry?.pre?.[key]  ?? 0);
          const post = Number(entry?.post?.[key] ?? 0);
          return { key, pre, post, change: post - pre };
        });
        const anyProvoked = isNPC
          ? npcDist > 5
          : changes.some((c) => c.change >= 2);

        return (
          <div
            key={test}
            className={clsx(
              "rounded-xl border p-4",
              anyProvoked ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
            )}
          >
            {/* Test header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-800">{test}</h4>
                {anyProvoked ? (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">🚩 Provoked</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Normal</span>
                )}
              </div>
              {isNPC && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 whitespace-nowrap">NPC distance (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    {...register(`voms.${test}.npcDistance` as const)}
                    placeholder="cm"
                    className={clsx(inputCls, "w-20", npcDist > 5 && "border-red-400 bg-red-50")}
                  />
                  {npcDist > 0 && (
                    <span className={clsx("text-xs font-medium", npcDist > 5 ? "text-red-600" : "text-emerald-600")}>
                      {npcDist > 5 ? "Elevated" : "Normal"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Symptom grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr>
                    <th className="text-left py-1.5 pr-3 text-gray-400 font-medium w-12"></th>
                    {SYMPTOM_COLS.map(({ label }) => (
                      <th key={label} className="text-center py-1.5 px-1 text-gray-500 font-semibold">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Pre row */}
                  <tr>
                    <td className="pr-3 py-1 text-gray-500 font-medium text-xs">Pre</td>
                    {SYMPTOM_COLS.map(({ key }) => (
                      <td key={key} className="px-1 py-1">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          {...register(`voms.${test}.pre.${key}` as const)}
                          placeholder="0"
                          className={inputCls}
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Post row */}
                  <tr>
                    <td className="pr-3 py-1 text-gray-500 font-medium text-xs">Post</td>
                    {SYMPTOM_COLS.map(({ key }) => (
                      <td key={key} className="px-1 py-1">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          {...register(`voms.${test}.post.${key}` as const)}
                          placeholder="0"
                          className={inputCls}
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Change row */}
                  <tr className="border-t border-gray-100">
                    <td className="pr-3 py-1.5 text-gray-400 font-medium text-xs">Δ Change</td>
                    {changes.map(({ key, change }) => (
                      <td key={key} className={clsx("text-center py-1.5 px-1 text-sm", changeColor(change))}>
                        {change >= 0 ? "+" : ""}{change}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-400">
        All scores 0–10. A change (Δ) of ≥ 2 on any symptom indicates clinically relevant provocation. NPC &gt; 5 cm is flagged as elevated.
      </p>
    </div>
  );
}
