import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Text, View } from 'react-native';

import { ExternalActionButton } from '@/components/ui/ExternalActionButton';
import { getMealSavings } from '@/lib/recommendations/savings';
import type { DailyRecommendation } from '@/types/recommendation';
import { formatCurrency } from '@/utils/format';

type MealRecommendationCardProps = {
  recommendation: DailyRecommendation;
};

export function MealRecommendationCard({ recommendation }: MealRecommendationCardProps) {
  const savings = getMealSavings(recommendation.meal);

  return (
    <View className="overflow-hidden rounded-[28px] border border-plum-800 bg-plum-975">
      <ImageBackground
        source={{ uri: recommendation.meal.imageUrl }}
        imageStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        className="h-48 justify-end"
      >
        <LinearGradient
          colors={['rgba(24,3,19,0.2)', 'rgba(24,3,19,0.82)', 'rgba(24,3,19,0.96)']}
          locations={[0, 0.55, 1]}
          className="px-4 pb-4 pt-10"
        >
          <Text className="font-ui text-xs uppercase tracking-[2px] text-ocean-200">
            {recommendation.categoryLabel}
          </Text>
          <Text className="font-heading mt-1 text-xl text-ocean-50">{recommendation.meal.name}</Text>
          <Text className="font-copy mt-1 text-sm text-ocean-100/80">{recommendation.meal.vendor}</Text>
        </LinearGradient>
      </ImageBackground>

      <View className="gap-4 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="font-copy flex-1 text-sm leading-6 text-ocean-200">{recommendation.reason}</Text>
          <View className="items-end gap-2">
            <View className="rounded-full bg-plum-900 px-3 py-2">
              <Text className="font-ui text-sm text-ocean-100">
                {formatCurrency(recommendation.meal.price)}
              </Text>
            </View>
            <View className="rounded-full border border-ocean-500/25 bg-ocean-500/10 px-3 py-2">
              <Text className="font-ui text-xs text-ocean-100">save {formatCurrency(savings)}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="rounded-full border border-plum-800 bg-plum-950 px-3 py-2">
            <Text className="font-copy text-xs text-ocean-50">{recommendation.meal.proteinG}g protein</Text>
          </View>
          <View className="rounded-full border border-plum-800 bg-plum-950 px-3 py-2">
            <Text className="font-copy text-xs text-ocean-50">{recommendation.meal.fiberG}g fiber</Text>
          </View>
          <View className="rounded-full border border-plum-800 bg-plum-950 px-3 py-2">
            <Text className="font-copy text-xs text-ocean-50">
              score {recommendation.compositeScore.toFixed(1)}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {recommendation.actions.map((action) => (
            <ExternalActionButton
              key={`${recommendation.category}-${action.provider}-${action.label}`}
              action={action}
            />
          ))}
        </View>

        {recommendation.actionMessage ? (
          <Text className="font-copy text-xs leading-5 text-plum-100">{recommendation.actionMessage}</Text>
        ) : null}
      </View>
    </View>
  );
}
