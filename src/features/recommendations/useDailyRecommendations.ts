import { useQuery, useQueryClient } from '@tanstack/react-query';

import { selectDailyRecommendations } from '@/features/recommendations/selectDailyRecommendations';
import { fetchRecipeAction } from '@/services/api/fetchRecipeAction';
import { discoverDailyMeals } from '@/services/discovery/discoverDailyMeals';
import type { DailyRecommendation } from '@/types/recommendation';

async function enrichRecommendationActions(
  recommendation: DailyRecommendation,
): Promise<DailyRecommendation> {
  if (recommendation.meal.availability !== 'cook' || !recommendation.meal.recipeQuery) {
    return recommendation;
  }

  try {
    const recipeAction = await fetchRecipeAction(recommendation.meal.recipeQuery);

    return {
      ...recommendation,
      actions: [recipeAction],
    };
  } catch (error) {
    const fallbackAction = recommendation.actions.find((action) => action.kind === 'recipe');
    if (!fallbackAction) {
      throw error;
    }

    return {
      ...recommendation,
      actions: [
        {
          ...fallbackAction,
          label: 'Open saved recipe',
        },
      ],
      actionMessage:
        error instanceof Error
          ? `${error.message} Showing a saved recipe link instead.`
          : 'We could not load a live recipe link. Showing a saved recipe instead.',
    };
  }
}

export function useDailyRecommendations() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['daily-recommendations'],
    queryFn: async () => {
      try {
        const discovery = await queryClient.ensureQueryData({
          queryKey: ['daily-discovery'],
          queryFn: discoverDailyMeals,
          staleTime: 1000 * 60 * 5,
        });

        const recommendations = selectDailyRecommendations(discovery.meals);

        return {
          generatedAt: discovery.generatedAt,
          freshnessLabel: discovery.freshnessLabel,
          sourceCount: discovery.summary.sourceCount,
          mealCount: discovery.summary.mealCount,
          items: await Promise.all(recommendations.map(enrichRecommendationActions)),
        };
      } catch {
        throw new Error("We could not prepare today's meal recommendations.");
      }
    },
  });
}
