import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { mockMealCandidates } from '@/constants/mockData';
import { buildRecommendationCollections } from '@/lib/recommendations/collections';
import { useDailyRecommendations } from '@/features/recommendations/useDailyRecommendations';

export function RecommendationsScreen() {
  const router = useRouter();
  const discovery = useDailyDiscovery();
  const recommendations = useDailyRecommendations();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const sections = useMemo(() => buildRecommendationCollections(discoveredMeals), [discoveredMeals]);

  return (
    <AppScreen>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.category}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View className="mb-8">
            <SectionHeader title={item.title} />
            <Text className="mb-4 font-body text-sm text-text-secondary">{item.subtitle}</Text>
            <FlatList
              horizontal
              data={item.meals}
              keyExtractor={(meal) => `${item.category}-${meal.id}`}
              renderItem={({ item: meal }) => (
                <MealCard
                  meal={meal}
                  variant="compact"
                  ctaLabel={meal.availability === 'cook' ? 'Recipe' : 'View'}
                  onPress={() => {
                    router.push({ pathname: '/meals/[mealId]', params: { mealId: meal.id } });
                  }}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        ListHeaderComponent={
          <View className="mb-6 gap-2">
            <Text className="font-medium text-sm text-text-secondary">Six daily recommendation lanes</Text>
            <Text className="font-heading text-[30px] leading-9 text-text-primary">
              Budget, protein, fiber, sugar, balance, and home cooking
            </Text>
            <Text className="font-body text-sm leading-6 text-text-secondary">
              {recommendations.data
                ? `${recommendations.data.freshnessLabel} · ${recommendations.data.sourceCount} sources · ${recommendations.data.mealCount} discovered meals`
                : 'Building recommendations from today’s meal discovery batch...'}
            </Text>
          </View>
        }
      />
    </AppScreen>
  );
}
