import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import { useAppSettings } from '@/components/providers/AppSettingsProvider';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { getMealSavings, getMealSavingsPercentage } from '@/lib/recommendations/savings';
import type { MealCandidate } from '@/types/recommendation';
import { formatCurrency, formatPercentage } from '@/utils/format';

type MealCardProps = {
  meal: MealCandidate;
  variant: 'featured' | 'compact' | 'list';
  eyebrow?: string;
  ctaLabel?: string;
  subtitle?: string;
  onPress?: () => void;
};

function MealMeta({ meal }: { meal: MealCandidate }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      <View className="rounded-full bg-background px-3 py-1.5">
        <Text className="font-medium text-xs text-text-secondary">{meal.calories} cal</Text>
      </View>
      <View className="rounded-full bg-background px-3 py-1.5">
        <Text className="font-medium text-xs text-text-secondary">{meal.rating.toFixed(1)} rating</Text>
      </View>
      <View className="rounded-full bg-background px-3 py-1.5">
        <Text className="font-medium text-xs text-text-secondary">{meal.prepTimeMinutes} min</Text>
      </View>
    </View>
  );
}

function MealFooter({ meal, ctaLabel = 'View meal' }: { meal: MealCandidate; ctaLabel?: string }) {
  const savings = getMealSavings(meal);
  const savingsPercentage = getMealSavingsPercentage(meal);

  return (
    <View className="mt-4 flex-row items-center justify-between gap-3">
      <View className="flex-1 gap-1">
        <Text className="font-heading text-lg text-text-primary">{formatCurrency(meal.price)}</Text>
        <Text className="font-medium text-xs text-text-secondary">
          {formatCurrency(meal.marketPrice)} reference · {meal.sourceLabel}
        </Text>
        <Text className="font-medium text-xs text-health">
          Save {formatCurrency(savings)} ({formatPercentage(savingsPercentage)}) {meal.comparisonLabel}
        </Text>
      </View>
      <View className="rounded-full bg-accent px-4 py-3">
        <Text className="font-ui text-sm text-background">{ctaLabel}</Text>
      </View>
    </View>
  );
}

export function MealCard({ meal, variant, eyebrow, ctaLabel, subtitle, onPress }: MealCardProps) {
  const { gradients } = useAppSettings();

  if (variant === 'featured') {
    return (
      <ScalePressable onPress={onPress}>
        <LinearGradient
          colors={[...gradients.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="overflow-hidden rounded-[28px] shadow-float"
          style={{ shadowColor: '#000000' }}
        >
          <View className="gap-4 p-4">
            <Image source={{ uri: meal.imageUrl }} className="h-56 w-full rounded-[24px]" resizeMode="cover" />
            <View className="gap-3">
              {eyebrow ? <Text className="font-ui text-xs uppercase tracking-[1.5px] text-background/70">{eyebrow}</Text> : null}
              <View className="gap-1">
                <Text className="font-heading text-[28px] leading-8 text-background">{meal.name}</Text>
                <Text className="font-medium text-sm text-background/70">
                  {meal.vendor} · {meal.sourceLabel}
                </Text>
              </View>
              <Text className="font-body text-sm leading-6 text-background/80">
                {subtitle ?? meal.description}
              </Text>
              <MealMeta meal={meal} />
              <MealFooter meal={meal} ctaLabel={ctaLabel} />
            </View>
          </View>
        </LinearGradient>
      </ScalePressable>
    );
  }

  if (variant === 'compact') {
    return (
      <ScalePressable className="mr-4 w-[270px]" onPress={onPress}>
        <View className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-soft" style={{ shadowColor: '#000000' }}>
          <Image source={{ uri: meal.imageUrl }} className="h-36 w-full" resizeMode="cover" />
          <View className="gap-3 p-4">
            <View className="gap-1">
              <Text className="font-heading text-lg text-text-primary">{meal.name}</Text>
              <Text className="font-medium text-sm text-text-secondary">
                {meal.vendor} · {meal.sourceLabel}
              </Text>
            </View>
            <MealMeta meal={meal} />
            <MealFooter meal={meal} ctaLabel={ctaLabel} />
          </View>
        </View>
      </ScalePressable>
    );
  }

  return (
    <ScalePressable onPress={onPress}>
      <View className="mb-4 flex-row gap-4 rounded-[24px] border border-border bg-surface p-3 shadow-soft" style={{ shadowColor: '#000000' }}>
        <Image source={{ uri: meal.imageUrl }} className="h-28 w-28 rounded-[20px]" resizeMode="cover" />
        <View className="flex-1 gap-2">
          {eyebrow ? <Text className="font-ui text-xs uppercase tracking-[1.5px] text-accent">{eyebrow}</Text> : null}
          <Text className="font-heading text-lg text-text-primary">{meal.name}</Text>
          <Text className="font-medium text-xs text-text-secondary">
            {meal.vendor} · {meal.sourceLabel}
          </Text>
          <Text className="font-body text-sm leading-5 text-text-secondary">
            {subtitle ?? meal.description}
          </Text>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-ui text-base text-text-primary">{formatCurrency(meal.price)}</Text>
              <Text className="font-medium text-xs text-text-muted">
                Save {formatCurrency(getMealSavings(meal))} · {formatCurrency(meal.marketPrice)} reference
              </Text>
            </View>
            <View className="rounded-full bg-elevated px-4 py-2.5">
              <Text className="font-ui text-xs text-accent">{ctaLabel ?? 'View meal'}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScalePressable>
  );
}
