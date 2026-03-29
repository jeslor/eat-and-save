import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getFavoriteMeals, mockMealCandidates } from '@/constants/mockData';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';

export function FavoritesScreen() {
  const router = useRouter();
  const discovery = useDailyDiscovery();
  const favoriteMeals = getFavoriteMeals(discovery.data?.meals ?? mockMealCandidates);

  return (
    <AppScreen>
      <FlatList
        data={favoriteMeals}
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
          <View className="pb-6">
            <SectionHeader title="Favorites" />
            <Text className="font-body text-sm leading-6 text-text-secondary">
              Your saved meals stay one tap away so you can quickly reorder, track, or cook them again.
            </Text>
            <Text className="mt-2 font-body text-sm leading-6 text-text-secondary">
              {discovery.data
                ? `${discovery.data.freshnessLabel} · favorites refreshed from today’s sources`
                : 'Refreshing favorite meals from today’s discovery batch...'}
            </Text>
          </View>
        }
      />
    </AppScreen>
  );
}
