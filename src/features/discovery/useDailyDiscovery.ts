import { useQuery } from '@tanstack/react-query';

import { discoverDailyMeals } from '@/services/discovery/discoverDailyMeals';

export function useDailyDiscovery() {
  return useQuery({
    queryKey: ['daily-discovery'],
    queryFn: discoverDailyMeals,
    staleTime: 1000 * 60 * 5,
  });
}
