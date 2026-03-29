import { FlatList, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { notificationItems } from '@/constants/mockData';

export function NotificationsScreen() {
  return (
    <AppScreen>
      <FlatList
        data={notificationItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-[24px] bg-surface p-5">
            <Text className="font-ui text-xs uppercase tracking-[1.5px] text-accent">{item.type}</Text>
            <Text className="mt-2 font-heading text-xl text-text-primary">{item.title}</Text>
            <Text className="mt-2 font-body text-sm leading-6 text-text-secondary">{item.description}</Text>
            <Text className="mt-3 font-medium text-xs text-text-muted">{item.timeLabel}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View className="pb-6">
            <Text className="font-medium text-sm text-text-secondary">Notifications</Text>
            <Text className="font-heading text-[30px] leading-9 text-text-primary">
              Alerts, reminders, and recommendation updates
            </Text>
          </View>
        }
      />
    </AppScreen>
  );
}
