import { useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getMealById } from '@/constants/mockData';

export function RecipeScreen() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  const meal = mealId ? getMealById(mealId) : null;

  if (!meal) {
    return (
      <AppScreen padded>
        <View className="flex-1 items-center justify-center">
          <Text className="font-heading text-2xl text-text-primary">Recipe not found</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <FlatList
        data={meal.recipeSteps}
        keyExtractor={(item, index) => `${meal.id}-recipe-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item, index }) => (
          <View className="mb-3 rounded-[24px] bg-surface p-4">
            <Text className="font-ui text-xs uppercase tracking-[1.5px] text-accent">Step {index + 1}</Text>
            <Text className="mt-2 font-body text-sm leading-6 text-text-secondary">{item}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="gap-1">
              <Text className="font-medium text-sm text-text-secondary">Recipe</Text>
              <Text className="font-heading text-[30px] leading-9 text-text-primary">{meal.name}</Text>
              <Text className="font-body text-sm leading-6 text-text-secondary">{meal.description}</Text>
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
            <View className="rounded-[24px] bg-elevated p-5">
              <SectionHeader title="Nutrition info" />
              <Text className="font-body text-sm leading-6 text-text-secondary">
                {meal.calories} calories · {meal.proteinG}g protein · {meal.fiberG}g fiber ·
                {` `}{meal.addedSugarG}g added sugar.
              </Text>
            </View>
          </View>
        }
      />
    </AppScreen>
  );
}
