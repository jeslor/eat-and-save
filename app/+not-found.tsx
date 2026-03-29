import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-plum-950 px-6">
      <Text className="font-heading text-2xl text-ocean-50">Screen not found</Text>
      <Link href="/" className="rounded-full bg-ocean-500 px-5 py-3 text-plum-950">
        Back home
      </Link>
    </View>
  );
}
