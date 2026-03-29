import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

import { ScalePressable } from '@/components/ui/ScalePressable';
import { themeColors } from '@/constants/theme';

type SearchFieldProps = {
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  onPress?: () => void;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search meals, ingredients, or deals',
  editable = true,
  onPress,
}: SearchFieldProps) {
  const content = (
    <View className="flex-row items-center gap-3 rounded-[22px] border border-border bg-surface px-4 py-3">
      <MaterialCommunityIcons name="magnify" size={20} color={themeColors.textMuted} />
      <TextInput
        className="flex-1 text-base text-text-primary"
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
      />
    </View>
  );

  if (onPress) {
    return <ScalePressable onPress={onPress}>{content}</ScalePressable>;
  }

  return content;
}
