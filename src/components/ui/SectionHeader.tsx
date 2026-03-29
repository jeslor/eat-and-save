import { Text, View } from 'react-native';

import { ScalePressable } from '@/components/ui/ScalePressable';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="font-heading text-xl text-text-primary">{title}</Text>
      {actionLabel && onPressAction ? (
        <ScalePressable onPress={onPressAction}>
          <Text className="font-ui text-sm text-accent">{actionLabel}</Text>
        </ScalePressable>
      ) : null}
    </View>
  );
}
