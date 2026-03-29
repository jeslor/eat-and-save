import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { mockMealCandidates, savingsInsights } from '@/constants/mockData';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';
import { getMealSavings, getMealSavingsPercentage } from '@/lib/recommendations/savings';
import { formatCurrency, formatPercentage } from '@/utils/format';

export function SavingsScreen() {
  const router = useRouter();
  const discovery = useDailyDiscovery();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const bestDeals = useMemo(
    () => [...discoveredMeals].sort((left, right) => getMealSavings(right) - getMealSavings(left)).slice(0, 4),
    [discoveredMeals],
  );
  const topDeal = bestDeals[0];

  return (
    <AppScreen>
      <FlatList
        data={bestDeals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            variant="list"
            ctaLabel="View"
            onPress={() => {
              router.push({ pathname: '/meals/[mealId]', params: { mealId: item.id } });
            }}
          />
        )}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="gap-1">
              <Text className="font-medium text-sm text-text-secondary">Savings insights</Text>
              <Text className="font-heading text-[30px] leading-9 text-text-primary">
                Track how much smarter picks are saving you
              </Text>
              <Text className="font-body text-sm leading-6 text-text-secondary">
                {discovery.data
                  ? `${discovery.data.freshnessLabel} · ${discovery.data.summary.sourceCount} sources scanned today`
                  : 'Loading today’s savings scan...'}
              </Text>
            </View>
            <View className="flex-row gap-3">
              {savingsInsights.map((item) => (
                <View key={item.label} className="flex-1 rounded-[24px] bg-surface p-4">
                  <Text className="font-medium text-xs uppercase tracking-[1.5px] text-text-muted">
                    {item.label}
                  </Text>
                  <Text className="mt-2 font-heading text-xl text-text-primary">
                    ${item.amount.toFixed(2)}
                  </Text>
                  <Text className="mt-1 font-body text-xs text-text-secondary">{item.comparison}</Text>
                </View>
              ))}
            </View>
            {topDeal ? (
              <View className="rounded-[24px] bg-surface p-5">
                <SectionHeader title="How savings are calculated" />
                <Text className="font-body text-sm leading-6 text-text-secondary">
                  {topDeal.name} costs {formatCurrency(topDeal.price)} today from {topDeal.sourceLabel}, compared
                  with a {formatCurrency(topDeal.marketPrice)} reference price. That saves{' '}
                  {formatCurrency(getMealSavings(topDeal))} ({formatPercentage(getMealSavingsPercentage(topDeal))}){' '}
                  {topDeal.comparisonLabel}.
                </Text>
              </View>
            ) : null}
            <SectionHeader title="Best current deals" />
          </View>
        }
      />
    </AppScreen>
  );
}
