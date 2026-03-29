import { mockMealCandidates } from '@/constants/mockData';
import { selectDailyRecommendations } from '@/features/recommendations/selectDailyRecommendations';

describe('selectDailyRecommendations', () => {
  it('returns one unique meal for each expanded recommendation bucket', () => {
    const recommendations = selectDailyRecommendations(mockMealCandidates);

    expect(recommendations).toHaveLength(6);
    expect(recommendations.map((item) => item.category)).toEqual([
      'budget',
      'highProtein',
      'highFiber',
      'lowSugar',
      'bestOverall',
      'cookAtHome',
    ]);
    expect(new Set(recommendations.map((item) => item.meal.id)).size).toBe(6);
  });

  it('keeps prices and action links on every surfaced recommendation', () => {
    const recommendations = selectDailyRecommendations(mockMealCandidates);

    expect(recommendations[0]?.meal.id).toBe('lentil-power-wrap');
    expect(recommendations[1]?.meal.id).toBe('grilled-chicken-bowl');
    expect(recommendations.every((item) => item.meal.price > 0)).toBe(true);
    expect(recommendations.every((item) => item.actions.length > 0)).toBe(true);
    expect(recommendations[5]?.meal.availability).toBe('cook');
  });
});
