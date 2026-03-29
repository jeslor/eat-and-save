import { Text, View } from 'react-native';

import { ScalePressable } from '@/components/ui/ScalePressable';

type QuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantitySelector({ quantity, onDecrease, onIncrease }: QuantitySelectorProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-[22px] border border-border bg-surface p-2">
      <ScalePressable className="rounded-full bg-elevated px-4 py-3" onPress={onDecrease}>
        <Text className="font-ui text-base text-text-primary">-</Text>
      </ScalePressable>
      <Text className="font-heading min-w-[32px] text-center text-lg text-text-primary">{quantity}</Text>
      <ScalePressable className="rounded-full bg-accent px-4 py-3" onPress={onIncrease}>
        <Text className="font-ui text-base text-background">+</Text>
      </ScalePressable>
    </View>
  );
}
