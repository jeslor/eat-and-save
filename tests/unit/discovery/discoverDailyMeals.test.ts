import { discoverySources, mockMealCandidates } from '@/constants/mockData';
import { discoverDailyMeals } from '@/services/discovery/discoverDailyMeals';

describe('discoverDailyMeals', () => {
  it('returns a fresh batch with configured sources and normalized meals', async () => {
    const batch = await discoverDailyMeals();

    expect(batch.meals).toHaveLength(mockMealCandidates.length);
    expect(batch.sources).toHaveLength(discoverySources.length);
    expect(batch.freshnessLabel.startsWith('Updated ')).toBe(true);
    expect(batch.meals.every((meal) => Boolean(meal.sourceLabel && meal.sourceUrl && meal.discoveredAt))).toBe(
      true,
    );
    expect(batch.summary.sourceCount).toBe(discoverySources.length);
  });
});
