import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type GradientCardProps = PropsWithChildren<{
  colors: [string, string, ...string[]];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}>;

export function GradientCard({
  children,
  colors,
  eyebrow,
  title,
  subtitle,
  className,
}: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`overflow-hidden rounded-[32px] border border-plum-800 p-5 ${className ?? ''}`}
    >
      <View className="gap-2">
        {eyebrow ? (
          <Text className="font-ui text-xs uppercase tracking-[2px] text-ocean-100/80">
            {eyebrow}
          </Text>
        ) : null}
        <Text className="font-heading text-2xl text-ocean-50">{title}</Text>
        {subtitle ? <Text className="font-copy text-sm leading-6 text-ocean-100/80">{subtitle}</Text> : null}
      </View>
      {children ? <View className="mt-5">{children}</View> : null}
    </LinearGradient>
  );
}
