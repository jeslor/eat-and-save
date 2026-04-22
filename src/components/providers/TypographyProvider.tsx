import { PropsWithChildren, useEffect } from 'react';
import { Text, TextInput, type TextInputProps, type TextProps } from 'react-native';

import { useAppSettings } from '@/components/providers/AppSettingsProvider';

type TextWithDefaults = typeof Text & {
  defaultProps?: TextProps;
};

type TextInputWithDefaults = typeof TextInput & {
  defaultProps?: TextInputProps;
};

export function TypographyProvider({ children }: PropsWithChildren) {
  const { colors } = useAppSettings();

  useEffect(() => {
    const TextComponent = Text as TextWithDefaults;
    const TextInputComponent = TextInput as TextInputWithDefaults;

    const previousTextDefaults = TextComponent.defaultProps;
    const previousTextInputDefaults = TextInputComponent.defaultProps;

    TextComponent.defaultProps = {
      ...previousTextDefaults,
      style: [
        {
          color: colors.textPrimary,
          fontFamily: 'Inter_400Regular',
        },
        previousTextDefaults?.style,
      ],
    };

    TextInputComponent.defaultProps = {
      ...previousTextInputDefaults,
      placeholderTextColor: previousTextInputDefaults?.placeholderTextColor ?? colors.textMuted,
      style: [
        {
          color: colors.textPrimary,
          fontFamily: 'Inter_500Medium',
        },
        previousTextInputDefaults?.style,
      ],
    };

    return () => {
      TextComponent.defaultProps = previousTextDefaults;
      TextInputComponent.defaultProps = previousTextInputDefaults;
    };
  }, [colors.textMuted, colors.textPrimary]);

  return children;
}
