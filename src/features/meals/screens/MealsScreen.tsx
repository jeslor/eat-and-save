import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { mockMealCandidates } from '@/constants/mockData';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';
import { rankMealCandidates, scoreMealCandidate } from '@/features/recommendations/selectDailyRecommendations';
import { getTotalMealSavings } from '@/lib/recommendations/savings';
import { formatCurrency } from '@/utils/format';

export function MealsScreen() {
  const router = useRouter();
  const discovery = useDailyDiscovery();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const rankedMeals = rankMealCandidates(discoveredMeals);
  const totalSavings = getTotalMealSavings(discoveredMeals);

  return (
    <AppScreen>
      <FlatList
        data={rankedMeals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const score = scoreMealCandidate(item);

          return (
            <MealCard
              meal={item}
              variant="list"
              subtitle={`Score ${score.compositeScore.toFixed(1)} · ${item.proteinG}g protein · ${item.fiberG}g fiber`}
              ctaLabel={item.availability === 'cook' ? 'Recipe' : 'View'}
              onPress={() => {
                router.push({ pathname: '/meals/[mealId]', params: { mealId: item.id } });
              }}
            />
          );
        }}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="gap-1">
              <Text className="font-medium text-sm text-text-secondary">Meal catalogue</Text>
              <Text className="font-heading text-[30px] leading-9 text-text-primary">
                Orderable meals and cook-at-home options
              </Text>
              <Text className="font-body text-sm leading-6 text-text-secondary">
                {discovery.data
                  ? `${discovery.data.freshnessLabel} · ${discovery.data.summary.mealCount} meals across ${discovery.data.summary.sourceCount} sources`
                  : 'Loading the latest discovered meal catalogue...'}
              </Text>
            </View>
            <SearchField
              value=""
              editable={false}
              onPress={() => {
                router.push('/search');
              }}
            />
            <View className="rounded-[28px] bg-surface p-5">
              <SectionHeader title="Deal snapshot" />
              <Text className="font-body text-sm leading-6 text-text-secondary">
                {rankedMeals.length} ranked meals with visible pricing, nutrition, and savings. Estimated
                savings currently total {formatCurrency(totalSavings)}.
              </Text>
            </View>
          </View>
        }
      />
    </AppScreen>
  );
}
