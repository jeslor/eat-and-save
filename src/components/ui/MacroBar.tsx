import { View, Text } from 'react-native';

type MacroBarProps = {
  label: string;
  value: number;
  max: number;
  colorClassName: string;
  suffix?: string;
};

export function MacroBar({ label, value, max, colorClassName, suffix = 'g' }: MacroBarProps) {
  const progress = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-medium text-sm text-text-secondary">{label}</Text>
        <Text className="font-ui text-sm text-text-primary">
          {Math.round(value)}
          {suffix}
        </Text>
      </View>
      <View className="h-3 overflow-hidden rounded-full bg-background">
        <View className={`h-3 rounded-full ${colorClassName}`} style={{ width: `${progress}%` }} />
      </View>
    </View>
  );
}
