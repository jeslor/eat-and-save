import { Text } from 'react-native';

import { ScalePressable } from '@/components/ui/ScalePressable';

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ label, active = false, onPress }: CategoryChipProps) {
  return (
    <ScalePressable
      className={`mr-3 rounded-full border px-4 py-2.5 ${
        active ? 'border-accent bg-accent' : 'border-border bg-surface'
      }`}
      onPress={onPress}
    >
      <Text className={`font-ui text-sm ${active ? 'text-background' : 'text-text-secondary'}`}>
        {label}
      </Text>
    </ScalePressable>
  );
}
