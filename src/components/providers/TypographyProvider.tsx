import { PropsWithChildren, useEffect } from 'react';
import { Text, TextInput, type TextInputProps, type TextProps } from 'react-native';

type TextWithDefaults = typeof Text & {
  defaultProps?: TextProps;
};

type TextInputWithDefaults = typeof TextInput & {
  defaultProps?: TextInputProps;
};

export function TypographyProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const TextComponent = Text as TextWithDefaults;
    const TextInputComponent = TextInput as TextInputWithDefaults;

    const previousTextDefaults = TextComponent.defaultProps;
    const previousTextInputDefaults = TextInputComponent.defaultProps;

    TextComponent.defaultProps = {
      ...previousTextDefaults,
      style: [
        {
          color: '#FFFFFF',
          fontFamily: 'Inter_400Regular',
        },
        previousTextDefaults?.style,
      ],
    };

    TextInputComponent.defaultProps = {
      ...previousTextInputDefaults,
      placeholderTextColor: previousTextInputDefaults?.placeholderTextColor ?? '#6B7280',
      style: [
        {
          color: '#FFFFFF',
          fontFamily: 'Inter_500Medium',
        },
        previousTextInputDefaults?.style,
      ],
    };

    return () => {
      TextComponent.defaultProps = previousTextDefaults;
      TextInputComponent.defaultProps = previousTextInputDefaults;
    };
  }, []);

  return children;
}
