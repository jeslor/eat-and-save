import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type SectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  className?: string;
}>;

export function SectionCard({ children, title, subtitle, className }: SectionCardProps) {
  return (
    <View
      className={`gap-4 rounded-[28px] border border-plum-800 bg-plum-975/96 p-5 ${
        className ?? ''
      }`}
    >
      <View className="gap-1">
        <Text className="font-heading text-lg text-ocean-50">{title}</Text>
        {subtitle ? <Text className="font-copy text-sm text-ocean-300">{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}
