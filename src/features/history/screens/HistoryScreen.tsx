import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getMealById, mealHistoryEntries } from '@/constants/mockData';

export function HistoryScreen() {
  const router = useRouter();
  const history = mealHistoryEntries
    .map((entry) => ({ entry, meal: getMealById(entry.mealId) }))
    .filter((item): item is { entry: (typeof mealHistoryEntries)[number]; meal: NonNullable<ReturnType<typeof getMealById>> } => Boolean(item.meal));

  return (
    <AppScreen>
      <FlatList
        data={history}
        keyExtractor={(item) => item.entry.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <MealCard
            meal={item.meal}
            variant="list"
            eyebrow={item.entry.mealType}
            subtitle={`${item.entry.loggedAt} · ${item.meal.calories} cal`}
            ctaLabel="View"
            onPress={() => {
              router.push({ pathname: '/meals/[mealId]', params: { mealId: item.meal.id } });
            }}
          />
        )}
        ListHeaderComponent={
          <View className="pb-6">
            <SectionHeader title="Meal history" />
            <Text className="font-body text-sm leading-6 text-text-secondary">
              Review past meals and their nutrition details to keep your daily score consistent over time.
            </Text>
          </View>
        }
      />
    </AppScreen>
  );
}
