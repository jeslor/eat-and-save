import type { MealCandidate } from '@/types/recommendation';

export function getMealSavings(meal: MealCandidate) {
  return Math.max(0, meal.marketPrice - meal.price);
}

export function getMealSavingsPercentage(meal: MealCandidate) {
  if (meal.marketPrice <= 0) {
    return 0;
  }

  return Math.max(0, (getMealSavings(meal) / meal.marketPrice) * 100);
}

export function getTotalMealSavings(meals: MealCandidate[]) {
  return meals.reduce((total, meal) => total + getMealSavings(meal), 0);
}

export function getTopSavingsMeal(meals: MealCandidate[]) {
  return [...meals].sort((left, right) => getMealSavings(right) - getMealSavings(left))[0] ?? null;
}
