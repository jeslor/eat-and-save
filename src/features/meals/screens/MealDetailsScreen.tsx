import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalActionButton } from '@/components/ui/ExternalActionButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getMealById, mockMealCandidates } from '@/constants/mockData';
import { themeColors } from '@/constants/theme';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';
import { getMealSavings, getMealSavingsPercentage } from '@/lib/recommendations/savings';
import { formatCurrency, formatDiscoveryFreshness, formatPercentage } from '@/utils/format';

export function MealDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  const discovery = useDailyDiscovery();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const meal = useMemo(() => (mealId ? getMealById(mealId, discoveredMeals) : null), [discoveredMeals, mealId]);
  const [quantity, setQuantity] = useState(1);

  if (!meal) {
    return (
      <AppScreen padded>
        <View className="flex-1 items-center justify-center">
          <Text className="font-heading text-2xl text-text-primary">Meal not found</Text>
        </View>
      </AppScreen>
    );
  }

  const primaryAction =
    meal.availability === 'cook'
      ? () => router.push({ pathname: '/recipe/[mealId]', params: { mealId: meal.id } })
      : () => router.push({ pathname: '/checkout', params: { mealId: meal.id } });

  return (
    <AppScreen>
      <View className="flex-1">
        <FlatList
          data={meal.recipeSteps}
          keyExtractor={(item, index) => `${meal.id}-step-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 160 }}
          renderItem={({ item, index }) => (
            <View className="mb-3 rounded-[22px] bg-surface p-4">
              <Text className="font-ui text-xs uppercase tracking-[1.5px] text-accent">
                Step {index + 1}
              </Text>
              <Text className="mt-2 font-body text-sm leading-6 text-text-secondary">{item}</Text>
            </View>
          )}
          ListHeaderComponent={
            <View className="gap-6 pb-6">
              <View className="flex-row items-center justify-between">
                <ScalePressable
                  className="rounded-full bg-surface p-3"
                  onPress={() => {
                    router.back();
                  }}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={20}
                    color={themeColors.textPrimary}
                  />
                </ScalePressable>
                <ScalePressable className="rounded-full bg-surface p-3">
                  <MaterialCommunityIcons
                    name={meal.isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={meal.isFavorite ? themeColors.accent : themeColors.textPrimary}
                  />
                </ScalePressable>
              </View>

              <Image source={{ uri: meal.imageUrl }} className="h-80 w-full rounded-[32px]" resizeMode="cover" />

              <View className="gap-3">
                <Text className="font-heading text-[30px] leading-9 text-text-primary">{meal.name}</Text>
                <Text className="font-ui text-sm text-accent">
                  {meal.sourceLabel}
                  {meal.discoveredAt ? ` · ${formatDiscoveryFreshness(meal.discoveredAt)}` : ''}
                </Text>
                <Text className="font-medium text-base text-text-secondary">
                  {meal.calories} calories · {meal.rating.toFixed(1)} rating · {meal.prepTimeMinutes} min
                </Text>
                <Text className="font-body text-sm leading-6 text-text-secondary">{meal.description}</Text>
              </View>

              <View className="flex-row items-center justify-between rounded-[28px] bg-surface p-5">
                <View>
                  <Text className="font-medium text-sm text-text-secondary">Quantity</Text>
                  <Text className="mt-1 font-ui text-sm text-health">
                    Save {formatCurrency(getMealSavings(meal) * quantity)} total
                  </Text>
                </View>
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={() => {
                    setQuantity((current) => Math.max(1, current - 1));
                  }}
                  onIncrease={() => {
                    setQuantity((current) => current + 1);
                  }}
                />
              </View>

              <View>
                <SectionHeader title="Ingredients" />
                <FlatList
                  horizontal
                  data={meal.ingredients}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View className="mr-3 items-center rounded-[22px] bg-surface px-4 py-4">
                      <Text className="text-2xl">{item.icon}</Text>
                      <Text className="mt-2 font-medium text-xs text-text-secondary">{item.name}</Text>
                    </View>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <View className="rounded-[28px] bg-surface p-5">
                <SectionHeader title="Price and savings" />
                <Text className="font-body text-sm leading-6 text-text-secondary">
                  {formatCurrency(meal.price)} current price · {formatCurrency(meal.marketPrice)} reference price ·
                  save {formatCurrency(getMealSavings(meal))} ({formatPercentage(getMealSavingsPercentage(meal))}){' '}
                  {meal.comparisonLabel}
                </Text>
                <Text className="mt-3 font-body text-sm leading-6 text-text-secondary">
                  {meal.proteinG}g protein · {meal.fiberG}g fiber · {meal.addedSugarG}g added sugar · source:{' '}
                  {meal.sourceUrl}
                </Text>
              </View>

              <View className="gap-3">
                <SectionHeader title="Actions" />
                <View className="flex-row flex-wrap gap-3">
                  {meal.actionLinks.map((action) => (
                    <ExternalActionButton key={`${meal.id}-${action.provider}-${action.label}`} action={action} />
                  ))}
                </View>
              </View>
            </View>
          }
        />

        <View
          className="absolute inset-x-0 bottom-0 border-t border-border bg-background px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <ScalePressable className="rounded-[24px] bg-accent px-5 py-4" onPress={primaryAction}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-heading text-lg text-background">
                  {formatCurrency(meal.price * quantity)}
                </Text>
                <Text className="font-medium text-xs text-background/70">
                  {meal.availability === 'cook' ? 'Open full recipe' : 'Continue to checkout'}
                </Text>
              </View>
              <Text className="font-ui text-base text-background">
                {meal.availability === 'cook' ? 'View recipe' : 'Checkout'}
              </Text>
            </View>
          </ScalePressable>
        </View>
      </View>
    </AppScreen>
  );
}
