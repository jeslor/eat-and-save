import { Text, View } from 'react-native';

type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View className="min-w-[96px] rounded-2xl border border-plum-800 bg-plum-950/80 px-4 py-3">
      <Text className="font-ui text-xs uppercase tracking-[1.5px] text-ocean-100/80">{label}</Text>
      <Text className="font-heading mt-1 text-lg text-ocean-50">{value}</Text>
    </View>
  );
}
