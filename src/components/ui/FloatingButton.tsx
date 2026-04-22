import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useAppSettings } from '@/components/providers/AppSettingsProvider';
import { ScalePressable } from '@/components/ui/ScalePressable';

type FloatingButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  onPress?: () => void;
};

export function FloatingButton({ icon, label, onPress }: FloatingButtonProps) {
  const { colors } = useAppSettings();

  return (
    <ScalePressable
      className="rounded-full bg-accent px-5 py-4 shadow-float"
      onPress={onPress}
      style={{ shadowColor: '#000000' }}
    >
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name={icon} size={20} color={colors.background} />
        {label ? <Text className="font-ui text-sm text-background">{label}</Text> : null}
      </View>
    </ScalePressable>
  );
}
