import { Text, View } from 'react-native';

type EnvironmentBannerProps = {
  configured: boolean;
};

export function EnvironmentBanner({ configured }: EnvironmentBannerProps) {
  if (configured) {
    return (
      <View className="rounded-2xl border border-ocean-500/30 bg-plum-975 p-4">
        <Text className="font-copy text-sm leading-6 text-ocean-100">
          Supabase is configured for this build. Authentication, sessions, and live data routes are ready to be used.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-plum-500/40 bg-plum-975 p-4">
      <Text className="font-copy text-sm leading-6 text-plum-100">
        Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to unlock live auth and data.
      </Text>
    </View>
  );
}
