import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { mockMealCandidates } from '@/constants/mockData';
import { useDailyDiscovery } from '@/features/discovery/useDailyDiscovery';

const priceFilters = [
  { id: 'all', label: 'Any price' },
  { id: 'under8', label: 'Under $8' },
  { id: 'under10', label: 'Under $10' },
] as const;

const calorieFilters = [
  { id: 'all', label: 'Any calories' },
  { id: 'under450', label: 'Under 450' },
  { id: 'under550', label: 'Under 550' },
] as const;

const dietFilters = [
  { id: 'all', label: 'All diets' },
  { id: 'cook', label: 'Cook at home' },
  { id: 'highProtein', label: 'High protein' },
] as const;

export function SearchScreen() {
  const router = useRouter();
  const discovery = useDailyDiscovery();
  const discoveredMeals = discovery.data?.meals ?? mockMealCandidates;
  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<(typeof priceFilters)[number]['id']>('all');
  const [calorieFilter, setCalorieFilter] = useState<(typeof calorieFilters)[number]['id']>('all');
  const [dietFilter, setDietFilter] = useState<(typeof dietFilters)[number]['id']>('all');

  const results = useMemo(() => {
    return discoveredMeals.filter((meal) => {
      const queryMatch =
        !query ||
        meal.name.toLowerCase().includes(query.toLowerCase()) ||
        meal.vendor.toLowerCase().includes(query.toLowerCase());
      const priceMatch =
        priceFilter === 'all' ||
        (priceFilter === 'under8' && meal.price < 8) ||
        (priceFilter === 'under10' && meal.price < 10);
      const calorieMatch =
        calorieFilter === 'all' ||
        (calorieFilter === 'under450' && meal.calories < 450) ||
        (calorieFilter === 'under550' && meal.calories < 550);
      const dietMatch =
        dietFilter === 'all' ||
        (dietFilter === 'cook' && meal.availability === 'cook') ||
        (dietFilter === 'highProtein' && meal.proteinG >= 25);

      return queryMatch && priceMatch && calorieMatch && dietMatch;
    });
  }, [calorieFilter, dietFilter, discoveredMeals, priceFilter, query]);

  return (
    <AppScreen>
      <FlatList
        data={results}
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
          <View className="gap-5 pb-6">
            <View className="gap-1">
              <Text className="font-medium text-sm text-text-secondary">Search results</Text>
              <Text className="font-heading text-[30px] leading-9 text-text-primary">
                Filter by price, calories, and diet
              </Text>
              <Text className="font-body text-sm leading-6 text-text-secondary">
                {discovery.data
                  ? `${discovery.data.freshnessLabel} · searching ${discovery.data.summary.mealCount} discovered meals`
                  : 'Searching the latest meal discovery batch...'}
              </Text>
            </View>
            <SearchField value={query} onChangeText={setQuery} />
            <View>
              <SectionHeader title="Price" />
              <FlatList
                horizontal
                data={priceFilters}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item.label}
                    active={item.id === priceFilter}
                    onPress={() => {
                      setPriceFilter(item.id);
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View>
              <SectionHeader title="Calories" />
              <FlatList
                horizontal
                data={calorieFilters}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item.label}
                    active={item.id === calorieFilter}
                    onPress={() => {
                      setCalorieFilter(item.id);
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View>
              <SectionHeader title="Diet" />
              <FlatList
                horizontal
                data={dietFilters}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item.label}
                    active={item.id === dietFilter}
                    onPress={() => {
                      setDietFilter(item.id);
                    }}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        }
      />
    </AppScreen>
  );
}
