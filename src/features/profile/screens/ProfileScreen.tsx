import { useRouter } from 'expo-router';
import { FlatList, Image, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getFavoriteMeals, mealHistoryEntries } from '@/constants/mockData';
import { useAuthSession } from '@/features/auth/useAuthSession';
import { getTotalMealSavings } from '@/lib/recommendations/savings';

export function ProfileScreen() {
  const router = useRouter();
  const { sessionEmail, sessionLoading } = useAuthSession();
  const favoriteMeals = getFavoriteMeals();
  const summaryItems = [
    { label: 'Saved meals', value: `${favoriteMeals.length}` },
    { label: 'Meals logged', value: `${mealHistoryEntries.length}` },
    { label: 'Money saved', value: `$${getTotalMealSavings(favoriteMeals).toFixed(2)}` },
  ];
  const settings = ['Notifications', 'Saved payment methods', 'Health preferences', 'Privacy controls'];

  return (
    <AppScreen>
      <FlatList
        data={settings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ScalePressable className="mb-3 rounded-[24px] bg-surface px-5 py-4">
            <Text className="font-medium text-base text-text-primary">{item}</Text>
          </ScalePressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="rounded-[28px] bg-surface p-5">
              <View className="flex-row items-center gap-4">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' }}
                  className="h-20 w-20 rounded-full"
                />
                <View className="flex-1 gap-1">
                  <Text className="font-heading text-2xl text-text-primary">Profile</Text>
                  <Text className="font-body text-sm text-text-secondary">
                    {sessionLoading
                      ? 'Checking session...'
                      : sessionEmail ?? 'Guest account'}
                  </Text>
                  <ScalePressable
                    className="mt-2 self-start rounded-full bg-accent px-4 py-2.5"
                    onPress={() => {
                      router.push('/auth');
                    }}
                  >
                    <Text className="font-ui text-sm text-background">Open auth center</Text>
                  </ScalePressable>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3">
              {summaryItems.map((item) => (
                <View key={item.label} className="flex-1 rounded-[24px] bg-surface p-4">
                  <Text className="font-medium text-xs uppercase tracking-[1.5px] text-text-muted">
                    {item.label}
                  </Text>
                  <Text className="mt-2 font-heading text-xl text-text-primary">{item.value}</Text>
                </View>
              ))}
            </View>

            <View>
              <SectionHeader
                title="Saved meals"
                actionLabel="See all"
                onPressAction={() => {
                  router.push('/favorites');
                }}
              />
              <FlatList
                horizontal
                data={favoriteMeals}
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

            <SectionHeader title="Settings" />
          </View>
        }
        ListFooterComponent={
          <View className="mt-6 rounded-[28px] bg-elevated p-5">
            <SectionHeader title="Activity summary" />
            <Text className="font-body text-sm leading-6 text-text-secondary">
              You are tracking meals consistently, keeping strong value-to-health picks in your saved list,
              and keeping account actions within easy reach.
            </Text>
          </View>
        }
      />
    </AppScreen>
  );
}
