import type {
  DailyRecommendation,
  MealCandidate,
  RecommendationCategory,
} from '@/types/recommendation';

const categoryLabels: Record<RecommendationCategory, string> = {
  budget: 'Budget pick',
  highProtein: 'High protein',
  highFiber: 'High fiber',
  lowSugar: 'Low sugar',
  bestOverall: 'Best overall',
  cookAtHome: 'Cook at home',
};

export function scoreMealCandidate(meal: MealCandidate) {
  const healthScore =
    meal.proteinG * 1.5 + meal.fiberG * 2 - meal.addedSugarG * 1.25 - meal.processedScore * 3;
  const valueToHealthRatio = healthScore / meal.price;
  const compositeScore = healthScore * 0.7 + valueToHealthRatio * 0.3;

  return {
    healthScore,
    valueToHealthRatio,
    compositeScore,
  };
}

export function rankMealCandidates(meals: MealCandidate[]) {
  return [...meals].sort(
    (left, right) => scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore,
  );
}

export function selectDailyRecommendations(meals: MealCandidate[]): DailyRecommendation[] {
  const requiredRecommendationCount = 6;

  if (meals.length < requiredRecommendationCount) {
    throw new Error('At least six meals are required to build daily recommendations.');
  }

  const availableMealIds = new Set(meals.map((meal) => meal.id));

  const pickBy = (
    category: RecommendationCategory,
    options: {
      filter?: (meal: MealCandidate) => boolean;
      sorter: (left: MealCandidate, right: MealCandidate) => number;
    },
    reasonBuilder: (meal: MealCandidate) => string,
  ) => {
    const candidates = meals
      .filter((meal) => availableMealIds.has(meal.id))
      .filter((meal) => (options.filter ? options.filter(meal) : true))
      .sort(options.sorter);

    const meal = candidates[0];
    if (!meal) {
      throw new Error(`A ${categoryLabels[category]} could not be selected.`);
    }

    availableMealIds.delete(meal.id);

    const scores = scoreMealCandidate(meal);

    return {
      category,
      categoryLabel: categoryLabels[category],
      meal,
      reason: reasonBuilder(meal),
      compositeScore: scores.compositeScore,
      actions: meal.actionLinks,
    } satisfies DailyRecommendation;
  };

  return [
    pickBy(
      'budget',
      {
        sorter: (left, right) =>
          scoreMealCandidate(right).valueToHealthRatio - scoreMealCandidate(left).valueToHealthRatio,
      },
      (meal) => `Strong nutrition density for ${meal.vendor} at one of the lowest prices today.`,
    ),
    pickBy(
      'highProtein',
      {
        sorter: (left, right) => right.proteinG - left.proteinG,
      },
      (meal) => `Top protein choice with ${meal.proteinG}g to support daily nutrition goals.`,
    ),
    pickBy(
      'highFiber',
      {
        sorter: (left, right) => right.fiberG - left.fiberG,
      },
      (meal) => `A fiber-first option with ${meal.fiberG}g to help keep you full for longer.`,
    ),
    pickBy(
      'lowSugar',
      {
        sorter: (left, right) => {
          if (left.addedSugarG !== right.addedSugarG) {
            return left.addedSugarG - right.addedSugarG;
          }

          return scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore;
        },
      },
      (meal) => `Keeps added sugar down at ${meal.addedSugarG}g without sacrificing overall nutrition.`,
    ),
    pickBy(
      'bestOverall',
      {
        sorter: (left, right) =>
          scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore,
      },
      (meal) => `Balanced cost, protein, and fiber make this the strongest overall option.`,
    ),
    pickBy(
      'cookAtHome',
      {
        filter: (meal) => meal.availability === 'cook',
        sorter: (left, right) =>
          scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore,
      },
      (meal) => `A smart self-prepared meal with a low ingredient cost and a strong health score.`,
    ),
  ];
}
