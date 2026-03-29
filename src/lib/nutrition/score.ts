import type { NutritionEntry } from '@/types/recommendation';

export function calculateDailyNutritionScore(entries: NutritionEntry[]) {
  const totals = entries.reduce(
    (accumulator, entry) => ({
      proteinG: accumulator.proteinG + entry.proteinG,
      fiberG: accumulator.fiberG + entry.fiberG,
      addedSugarG: accumulator.addedSugarG + entry.addedSugarG,
    }),
    { proteinG: 0, fiberG: 0, addedSugarG: 0 },
  );

  const proteinScore = Math.min(35, (totals.proteinG / 90) * 35);
  const fiberScore = Math.min(35, (totals.fiberG / 28) * 35);
  const sugarPenalty = Math.min(30, (totals.addedSugarG / 30) * 30);

  return Math.max(0, Math.round(proteinScore + fiberScore + (30 - sugarPenalty)));
}
