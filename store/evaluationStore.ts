import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Evaluation, Athlete } from "@/types";
import { SAMPLE_EVALUATIONS } from "@/data/sampleData";

interface EvaluationStore {
  evaluations: Evaluation[];
  selectedId: string | null;
  addEvaluation: (e: Evaluation) => void;
  removeEvaluation: (id: string) => void;
  selectEvaluation: (id: string | null) => void;
  getEvaluation: (id: string) => Evaluation | undefined;
  // Athlete-level helpers
  getAthleteEvaluations: (athleteId: string) => Evaluation[];
  getUniqueAthletes: () => Athlete[];
  loadSampleData: () => void;
}

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set, get) => ({
      evaluations: SAMPLE_EVALUATIONS,
      selectedId: null,

      addEvaluation: (e) =>
        set((state) => ({ evaluations: [e, ...state.evaluations] })),

      removeEvaluation: (id) =>
        set((state) => ({
          evaluations: state.evaluations.filter((e) => e.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        })),

      selectEvaluation: (id) => set({ selectedId: id }),

      getEvaluation: (id) => get().evaluations.find((e) => e.id === id),

      getAthleteEvaluations: (athleteId) =>
        get()
          .evaluations.filter((e) => e.athlete.id === athleteId)
          .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()),

      getUniqueAthletes: () => {
        const seen = new Map<string, Athlete>();
        for (const e of get().evaluations) {
          if (!seen.has(e.athlete.id)) seen.set(e.athlete.id, e.athlete);
        }
        return Array.from(seen.values());
      },

      loadSampleData: () => set({ evaluations: SAMPLE_EVALUATIONS }),
    }),
    {
      name: "concussion-eval-store",
      // Don't persist sample data — re-hydrate each session
      partialize: (state) => ({
        evaluations: state.evaluations.filter(
          (e) => !SAMPLE_EVALUATIONS.some((s) => s.id === e.id)
        ),
        selectedId: state.selectedId,
      }),
      onRehydrateStorage: () => (state) => {
        // Always ensure sample data is present
        if (state) {
          const hasReal = state.evaluations.some(
            (e) => !SAMPLE_EVALUATIONS.some((s) => s.id === e.id)
          );
          state.evaluations = [
            ...state.evaluations.filter(
              (e) => !SAMPLE_EVALUATIONS.some((s) => s.id === e.id)
            ),
            ...SAMPLE_EVALUATIONS,
          ];
        }
      },
    }
  )
);
