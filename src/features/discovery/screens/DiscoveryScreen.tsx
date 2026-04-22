import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { useAppSettings } from '@/components/providers/AppSettingsProvider';
import { AppScreen } from '@/components/ui/AppScreen';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  getMealsForBrowseCategory,
  getPopularMeals,
  mealBrowseCategories,
  mockMealCandidates,
} from '@/constants/mockData';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';
import { useDailyRecommendations } from '@/features/recommendations/useDailyRecommendations';
import { getTopSavingsMeal } from '@/lib/recommendations/savings';
import { formatCurrency } from '@/utils/format';
import type { MealBrowseCategory } from '@/types/recommendation';

export function DiscoveryScreen() {
  const router = useRouter();
  const { colors } = useAppSettings();
  const [activeCategory, setActiveCategory] = useState<MealBrowseCategory>('all');
  const discovery = useDailyDiscovery();
  const recommendations = useDailyRecommendations();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const featuredMeal = recommendations.data?.items[0]?.meal ?? discoveredMeals[0];
  const popularMeals = useMemo(() => getPopularMeals(discoveredMeals), [discoveredMeals]);
  const filteredMeals = useMemo(
    () => getMealsForBrowseCategory(activeCategory, discoveredMeals),
    [activeCategory, discoveredMeals],
  );
  const topSavingsMeal = useMemo(() => getTopSavingsMeal(discoveredMeals), [discoveredMeals]);

  return (
    <AppScreen>
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 24 }}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 gap-1 pr-4">
                <Text className="font-medium text-sm text-text-secondary">Today&apos;s healthy savings brief</Text>
                <Text className="font-heading text-[30px] leading-9 text-text-primary">
                  Fresh meal picks ranked by health and price
                </Text>
                <Text className="font-body text-sm leading-6 text-text-secondary">
                  {discovery.data
                    ? `${discovery.data.freshnessLabel} · ${discovery.data.summary.sourceCount} configured sources · ${discovery.data.summary.mealCount} meals found`
                    : 'Loading today’s meal discovery batch...'}
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <ScalePressable
                  className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-surface"
                  onPress={() => {
                    router.push('/notifications');
                  }}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={22}
                    color={colors.textPrimary}
                  />
                  <View className="absolute right-3.5 top-3.5 h-2.5 w-2.5 rounded-full bg-accent" />
                </ScalePressable>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                  }}
                  className="h-12 w-12 rounded-full"
                />
              </View>
            </View>

            <SearchField
              value=""
              editable={false}
              placeholder="Search meals, ingredients, or savings"
              onPress={() => {
                router.push('/search');
              }}
            />

            <View className="flex-row gap-3">
              <View className="flex-1 rounded-[24px] bg-surface p-4">
                <Text className="font-medium text-xs uppercase tracking-[1.5px] text-text-muted">
                  Top savings today
                </Text>
                <Text className="mt-2 font-heading text-lg text-text-primary">
                  {topSavingsMeal ? formatCurrency(topSavingsMeal.marketPrice - topSavingsMeal.price) : '$0.00'}
                </Text>
                <Text className="mt-1 font-body text-xs text-text-secondary">
                  {topSavingsMeal ? `${topSavingsMeal.name} from ${topSavingsMeal.sourceLabel}` : 'Checking sources'}
                </Text>
              </View>
              <View className="flex-1 rounded-[24px] bg-surface p-4">
                <Text className="font-medium text-xs uppercase tracking-[1.5px] text-text-muted">
                  Best current price
                </Text>
                <Text className="mt-2 font-heading text-lg text-text-primary">
                  {featuredMeal ? formatCurrency(featuredMeal.price) : '$0.00'}
                </Text>
                <Text className="mt-1 font-body text-xs text-text-secondary">
                  {featuredMeal ? `${featuredMeal.name} · ${featuredMeal.sourceLabel}` : 'Preparing today’s picks'}
                </Text>
              </View>
              <View className="flex-1 rounded-[24px] bg-surface p-4">
                <Text className="font-medium text-xs uppercase tracking-[1.5px] text-text-muted">
                  Healthy picks
                </Text>
                <Text className="mt-2 font-heading text-lg text-text-primary">6 lanes</Text>
                <Text className="mt-1 font-body text-xs text-text-secondary">
                  Budget, protein, fiber, sugar, balance, and cook-at-home
                </Text>
              </View>
            </View>

            <View>
              <SectionHeader title="Browse categories" />
              <FlatList
                horizontal
                data={mealBrowseCategories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item.label}
                    active={item.id === activeCategory}
                    onPress={() => {
                      setActiveCategory(item.id);
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {featuredMeal ? (
              <View>
                <SectionHeader
                  title="Featured from today&apos;s scan"
                  actionLabel="See all"
                  onPressAction={() => {
                    router.push('/recommendations');
                  }}
                />
                <MealCard
                  meal={featuredMeal}
                  variant="featured"
                  eyebrow={recommendations.data?.freshnessLabel ?? 'Today’s best overall'}
                  ctaLabel="View meal"
                  onPress={() => {
                    router.push({ pathname: '/meals/[mealId]', params: { mealId: featuredMeal.id } });
                  }}
                />
              </View>
            ) : null}

            <View>
              <SectionHeader
                title="Popular meals"
                actionLabel="See all"
                onPressAction={() => {
                  router.push('/meals');
                }}
              />
              <FlatList
                horizontal
                data={popularMeals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <MealCard
                    meal={item}
                    variant="compact"
                    ctaLabel="View"
                    onPress={() => {
                      router.push({ pathname: '/meals/[mealId]', params: { mealId: item.id } });
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <SectionHeader title="More matches from today" />
          </View>
        }
      />
    </AppScreen>
  );
}
