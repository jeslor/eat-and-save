import { discoverySources, mockMealCandidates } from '@/constants/mockData';
import { getMealSavings } from '@/lib/recommendations/savings';
import type { DailyDiscoveryBatch, DiscoverySourceStatus, MealCandidate } from '@/types/recommendation';
import { formatDiscoveryFreshness } from '@/utils/format';

function hydrateDiscoveredMeals(meals: MealCandidate[], generatedAt: string) {
  return meals.map((meal) => ({
    ...meal,
    discoveredAt: generatedAt,
  }));
}

function buildSourceStatuses(generatedAt: string): DiscoverySourceStatus[] {
  return discoverySources.map((source) => ({
    sourceId: source.id,
    sourceName: source.name,
    kind: source.kind,
    url: source.url,
    checkedAt: generatedAt,
    status: 'configured',
  }));
}

export async function discoverDailyMeals(): Promise<DailyDiscoveryBatch> {
  const generatedAt = new Date().toISOString();

  try {
    const meals = hydrateDiscoveredMeals(mockMealCandidates, generatedAt);
    const sources = buildSourceStatuses(generatedAt);

    return {
      generatedAt,
      freshnessLabel: formatDiscoveryFreshness(generatedAt),
      meals,
      sources,
      summary: {
        sourceCount: sources.length,
        mealCount: meals.length,
        fallbackUsed: false,
        topSavings: Math.max(...meals.map((meal) => getMealSavings(meal))),
      },
    };
  } catch {
    const meals = hydrateDiscoveredMeals(mockMealCandidates, generatedAt);
    const sources = discoverySources.map((source) => ({
      sourceId: source.id,
      sourceName: source.name,
      kind: source.kind,
      url: source.url,
      checkedAt: generatedAt,
      status: 'fallback' as const,
    }));

    return {
      generatedAt,
      freshnessLabel: `${formatDiscoveryFreshness(generatedAt)} · fallback`,
      meals,
      sources,
      summary: {
        sourceCount: sources.length,
        mealCount: meals.length,
        fallbackUsed: true,
        topSavings: Math.max(...meals.map((meal) => getMealSavings(meal))),
      },
    };
  }
}
