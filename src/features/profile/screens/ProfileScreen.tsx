import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Switch, Text, View } from 'react-native';

import { MealCard } from '@/components/meal/MealCard';
import { useAppSettings } from '@/components/providers/AppSettingsProvider';
import { AppScreen } from '@/components/ui/AppScreen';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getFavoriteMeals, mealHistoryEntries } from '@/constants/mockData';
import { useAuthSession } from '@/features/auth/useAuthSession';
import { getTotalMealSavings } from '@/lib/recommendations/savings';
import { signOutCurrentUser } from '@/services/supabase/auth';

export function ProfileScreen() {
  const router = useRouter();
  const {
    colors,
    dailyBriefingEnabled,
    dealAlertsEnabled,
    nutritionRemindersEnabled,
    setDailyBriefingEnabled,
    setDealAlertsEnabled,
    setNutritionRemindersEnabled,
    setThemeMode,
    themeMode,
  } = useAppSettings();
  const { sessionEmail, sessionFullName, sessionLoading } = useAuthSession();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const favoriteMeals = getFavoriteMeals();
  const summaryItems = [
    { label: 'Saved meals', value: `${favoriteMeals.length}` },
    { label: 'Meals logged', value: `${mealHistoryEntries.length}` },
    { label: 'Money saved', value: `$${getTotalMealSavings(favoriteMeals).toFixed(2)}` },
  ];
  const settings = [
    {
      label: 'Daily recommendation briefing',
      description: 'Receive each morning’s top healthy and affordable meal picks.',
      value: dailyBriefingEnabled,
      onValueChange: setDailyBriefingEnabled,
    },
    {
      label: 'Deal alerts',
      description: 'Highlight strong restaurant savings as they appear.',
      value: dealAlertsEnabled,
      onValueChange: setDealAlertsEnabled,
    },
    {
      label: 'Nutrition reminders',
      description: 'Stay on track with a better daily nutrition score.',
      value: nutritionRemindersEnabled,
      onValueChange: setNutritionRemindersEnabled,
    },
  ];

  async function handleSignOut() {
    setSignOutError(null);

    try {
      await signOutCurrentUser();
      router.replace('/(tabs)');
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Sign out failed.');
    }
  }

  return (
    <AppScreen>
      <FlatList
        data={settings}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-[24px] bg-surface px-5 py-4">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text className="font-medium text-base text-text-primary">{item.label}</Text>
                <Text className="mt-1 font-body text-sm leading-6 text-text-secondary">
                  {item.description}
                </Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                thumbColor={item.value ? colors.accent : colors.elevated}
                trackColor={{ false: colors.border, true: `${colors.accent}66` }}
              />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="rounded-[28px] bg-surface p-5">
              <View className="flex-row items-center gap-4">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
                  }}
                  className="h-20 w-20 rounded-full"
                />
                <View className="flex-1 gap-1">
                  <Text className="font-heading text-2xl text-text-primary">
                    {sessionLoading ? 'Profile' : sessionFullName ?? 'Profile'}
                  </Text>
                  <Text className="font-body text-sm text-text-secondary">
                    {sessionLoading ? 'Checking session...' : sessionEmail ?? 'Signed-in account'}
                  </Text>
                  <Text className="mt-2 font-body text-xs leading-5 text-text-secondary">
                    Your account keeps favorites, savings, and daily assistant preferences in sync.
                  </Text>
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

            <View className="gap-3 rounded-[28px] bg-elevated p-5">
              <SectionHeader title="Appearance" />
              <View className="flex-row rounded-[22px] bg-background p-1.5">
                <ScalePressable
                  className={`flex-1 rounded-[18px] px-4 py-3 ${themeMode === 'dark' ? 'bg-accent' : 'bg-background'}`}
                  onPress={() => {
                    setThemeMode('dark');
                  }}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <MaterialCommunityIcons
                      name="weather-night"
                      size={18}
                      color={themeMode === 'dark' ? colors.background : colors.textSecondary}
                    />
                    <Text
                      className={`font-ui text-sm ${themeMode === 'dark' ? 'text-background' : 'text-text-secondary'}`}
                    >
                      Dark
                    </Text>
                  </View>
                </ScalePressable>
                <ScalePressable
                  className={`flex-1 rounded-[18px] px-4 py-3 ${themeMode === 'light' ? 'bg-accent' : 'bg-background'}`}
                  onPress={() => {
                    setThemeMode('light');
                  }}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <MaterialCommunityIcons
                      name="white-balance-sunny"
                      size={18}
                      color={themeMode === 'light' ? colors.background : colors.textSecondary}
                    />
                    <Text
                      className={`font-ui text-sm ${themeMode === 'light' ? 'text-background' : 'text-text-secondary'}`}
                    >
                      Light
                    </Text>
                  </View>
                </ScalePressable>
              </View>
            </View>

            <SectionHeader title="Settings" />
          </View>
        }
        ListFooterComponent={
          <View className="mt-6 gap-4">
            <View className="rounded-[28px] bg-elevated p-5">
              <SectionHeader title="Activity summary" />
              <Text className="font-body text-sm leading-6 text-text-secondary">
                You are tracking meals consistently, building a strong list of value-to-health picks,
                and shaping how the assistant supports your routine.
              </Text>
            </View>
            <ScalePressable
              className="rounded-[24px] bg-surface px-5 py-4"
              onPress={() => {
                void handleSignOut();
              }}
            >
              <View className="flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons name="logout" size={18} color={colors.textPrimary} />
                <Text className="font-ui text-base text-text-primary">Sign out</Text>
              </View>
            </ScalePressable>
            {signOutError ? (
              <Text className="font-body text-sm leading-6 text-danger">{signOutError}</Text>
            ) : null}
          </View>
        }
      />
    </AppScreen>
  );
}
