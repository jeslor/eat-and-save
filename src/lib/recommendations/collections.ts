import { scoreMealCandidate } from '@/features/recommendations/selectDailyRecommendations';
import type { MealCandidate, RecommendationCategory } from '@/types/recommendation';

type RecommendationCollection = {
  category: RecommendationCategory;
  title: string;
  subtitle: string;
  meals: MealCandidate[];
};

const collectionDefinitions: Array<{
  category: RecommendationCategory;
  title: string;
  subtitle: string;
  filter?: (meal: MealCandidate) => boolean;
  sort: (left: MealCandidate, right: MealCandidate) => number;
}> = [
  {
    category: 'budget',
    title: 'Budget',
    subtitle: 'Top value-to-health deals',
    sort: (left, right) =>
      scoreMealCandidate(right).valueToHealthRatio - scoreMealCandidate(left).valueToHealthRatio,
  },
  {
    category: 'highProtein',
    title: 'High Protein',
    subtitle: 'Meals that drive protein intake',
    sort: (left, right) => right.proteinG - left.proteinG,
  },
  {
    category: 'highFiber',
    title: 'High Fiber',
    subtitle: 'More filling fiber-forward picks',
    sort: (left, right) => right.fiberG - left.fiberG,
  },
  {
    category: 'lowSugar',
    title: 'Low Sugar',
    subtitle: 'Cleaner options with less added sugar',
    sort: (left, right) => left.addedSugarG - right.addedSugarG,
  },
  {
    category: 'bestOverall',
    title: 'Best Overall',
    subtitle: 'Balanced winners across cost and nutrition',
    sort: (left, right) =>
      scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore,
  },
  {
    category: 'cookAtHome',
    title: 'Cook at Home',
    subtitle: 'Prep it yourself and save more',
    filter: (meal) => meal.availability === 'cook',
    sort: (left, right) =>
      scoreMealCandidate(right).compositeScore - scoreMealCandidate(left).compositeScore,
  },
];

export function buildRecommendationCollections(meals: MealCandidate[]): RecommendationCollection[] {
  return collectionDefinitions.map((definition) => ({
    category: definition.category,
    title: definition.title,
    subtitle: definition.subtitle,
    meals: meals
      .filter((meal) => (definition.filter ? definition.filter(meal) : true))
      .sort(definition.sort)
      .slice(0, 4),
  }));
}
