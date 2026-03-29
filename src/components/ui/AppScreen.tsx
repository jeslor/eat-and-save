import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppScreenProps = PropsWithChildren<{
  padded?: boolean;
}>;

export function AppScreen({ children, padded = false }: AppScreenProps) {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className={`flex-1 bg-background ${padded ? 'px-5' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
