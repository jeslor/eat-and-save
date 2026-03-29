import { useRouter } from "expo-router";
import { FlatList, Text, View } from "react-native";

import { MealCard } from "@/components/meal/MealCard";
import { AppScreen } from "@/components/ui/AppScreen";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { FloatingButton } from "@/components/ui/FloatingButton";
import { MacroBar } from "@/components/ui/MacroBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getMealById,
  mealHistoryEntries,
  mockMealCandidates,
  mockNutritionEntries,
} from "@/constants/mockData";
import { themeGradients } from "@/constants/theme";
import { calculateDailyNutritionScore } from "@/lib/nutrition/score";
import { getTotalMealSavings } from "@/lib/recommendations/savings";
import { formatCurrency } from "@/utils/format";
import { LinearGradient } from "expo-linear-gradient";

export function TrackerScreen() {
  const router = useRouter();
  const score = calculateDailyNutritionScore(mockNutritionEntries);
  const totalSavings = getTotalMealSavings(mockMealCandidates);
  const totals = mockNutritionEntries.reduce(
    (accumulator, entry) => ({
      proteinG: accumulator.proteinG + entry.proteinG,
      fiberG: accumulator.fiberG + entry.fiberG,
      addedSugarG: accumulator.addedSugarG + entry.addedSugarG,
    }),
    { proteinG: 0, fiberG: 0, addedSugarG: 0 },
  );
  const loggedMeals = mealHistoryEntries
    .map((entry) => ({ entry, meal: getMealById(entry.mealId) }))
    .filter(
      (
        item,
      ): item is {
        entry: (typeof mealHistoryEntries)[number];
        meal: NonNullable<ReturnType<typeof getMealById>>;
      } => Boolean(item.meal),
    );

  return (
    <AppScreen>
      <View className="flex-1">
        <FlatList
          data={loggedMeals}
          keyExtractor={(item) => item.entry.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <MealCard
              meal={item.meal}
              variant="list"
              eyebrow={item.entry.mealType}
              subtitle={`${item.entry.loggedAt} · ${item.meal.proteinG}g protein · ${formatCurrency(item.meal.price)}`}
              ctaLabel="Track"
              onPress={() => {
                router.push({
                  pathname: "/meals/[mealId]",
                  params: { mealId: item.meal.id },
                });
              }}
            />
          )}
          ListHeaderComponent={
            <View className="gap-6 pb-6">
              <View className="gap-1">
                <Text className="font-medium text-sm text-text-secondary">
                  Daily nutrition score
                </Text>
                <Text className="font-heading text-[30px] leading-9 text-text-primary">
                  Stay on top of nutrition and savings
                </Text>
              </View>

              <View className="rounded-[20] overflow-hidden">
                <LinearGradient
                  colors={[...themeGradients.accent]}
                  className="rounded-[28px] p-5 "
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="flex-row items-center justify-between gap-4 p-7 ">
                    <CircularProgress
                      value={score}
                      max={100}
                      label="daily score"
                      color="#0F0F14"
                      trackColor="rgba(15,15,20,0.18)"
                    />
                    <View className="flex-1 gap-2">
                      <Text className="font-heading text-2xl text-background">
                        {score}/100
                      </Text>
                      <Text className="font-body text-sm leading-6 text-background/80">
                        Protein and fiber are lifting your score while sugar
                        stays under control.
                      </Text>
                      <Text className="font-ui text-sm text-background">
                        Saved today {formatCurrency(totalSavings)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View className="gap-4 rounded-[28px] bg-surface p-5">
                <SectionHeader title="Macro breakdown" />
                <MacroBar
                  label="Protein"
                  value={totals.proteinG}
                  max={90}
                  colorClassName="bg-accent"
                />
                <MacroBar
                  label="Fiber"
                  value={totals.fiberG}
                  max={28}
                  colorClassName="bg-health"
                />
                <MacroBar
                  label="Sugar"
                  value={totals.addedSugarG}
                  max={30}
                  colorClassName="bg-warning"
                />
              </View>

              <SectionHeader title="Logged meals" />
            </View>
          }
        />

        <View className="absolute bottom-8 right-5">
          <FloatingButton
            icon="plus"
            label="Add meal"
            onPress={() => {
              router.push("/search");
            }}
          />
        </View>
      </View>
    </AppScreen>
  );
}
