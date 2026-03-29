import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type InternalLinkButtonProps = {
  href: Href;
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
};

export function InternalLinkButton({
  href,
  title,
  subtitle,
  icon,
  variant = 'secondary',
  fullWidth = true,
}: InternalLinkButtonProps) {
  const containerClassName =
    variant === 'primary'
      ? 'border-ocean-400/30 bg-ocean-500'
      : 'border-plum-800 bg-plum-975';

  const titleClassName = variant === 'primary' ? 'text-plum-950' : 'text-ocean-50';
  const subtitleClassName = variant === 'primary' ? 'text-plum-900/70' : 'text-ocean-300';

  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        className={`rounded-[24px] border px-4 py-4 ${containerClassName} ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        <View className="gap-2">
          <View className="flex-row items-center gap-3">
            {icon ? (
              <View className={`${variant === 'primary' ? 'bg-plum-950/12' : 'bg-plum-900'} rounded-2xl p-2.5`}>
                <MaterialCommunityIcons
                  name={icon}
                  size={18}
                  color={variant === 'primary' ? '#26051f' : '#97b0ce'}
                />
              </View>
            ) : null}
            <Text className={`font-ui text-base ${titleClassName}`}>{title}</Text>
          </View>
          {subtitle ? <Text className={`font-copy text-sm leading-5 ${subtitleClassName}`}>{subtitle}</Text> : null}
        </View>
      </Pressable>
    </Link>
  );
}
