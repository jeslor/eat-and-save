import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { ScalePressable } from '@/components/ui/ScalePressable';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { deliveryOptions, getMealById, paymentMethods } from '@/constants/mockData';
import { formatCurrency } from '@/utils/format';

export function CheckoutScreen() {
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const meal = useMemo(() => (mealId ? getMealById(mealId) : getMealById('grilled-chicken-bowl')), [mealId]);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]?.id ?? '');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id ?? '');

  if (!meal) {
    return (
      <AppScreen padded>
        <View className="flex-1 items-center justify-center">
          <Text className="font-heading text-2xl text-text-primary">Checkout unavailable</Text>
        </View>
      </AppScreen>
    );
  }

  const delivery = deliveryOptions.find((item) => item.id === selectedDelivery) ?? deliveryOptions[0];
  const total = meal.price + (delivery?.fee ?? 0);

  return (
    <AppScreen>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <ScalePressable
            className={`mb-3 rounded-[24px] border p-4 ${
              item.id === selectedPayment ? 'border-accent bg-surface' : 'border-border bg-surface'
            }`}
            onPress={() => {
              setSelectedPayment(item.id);
            }}
          >
            <Text className="font-ui text-base text-text-primary">{item.label}</Text>
            <Text className="mt-1 font-body text-sm text-text-secondary">{item.subtitle}</Text>
          </ScalePressable>
        )}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="gap-1">
              <Text className="font-medium text-sm text-text-secondary">Checkout</Text>
              <Text className="font-heading text-[30px] leading-9 text-text-primary">
                Confirm your meal and payment
              </Text>
            </View>
            <View className="rounded-[28px] bg-surface p-5">
              <SectionHeader title="Delivery options" />
              {deliveryOptions.map((item) => (
                <ScalePressable
                  key={item.id}
                  className={`mb-3 rounded-[22px] border p-4 ${
                    item.id === selectedDelivery ? 'border-accent bg-elevated' : 'border-border bg-elevated'
                  }`}
                  onPress={() => {
                    setSelectedDelivery(item.id);
                  }}
                >
                  <Text className="font-ui text-base text-text-primary">{item.label}</Text>
                  <Text className="mt-1 font-body text-sm text-text-secondary">
                    {item.eta} · {item.fee === 0 ? 'Free' : formatCurrency(item.fee)}
                  </Text>
                </ScalePressable>
              ))}
            </View>
            <SectionHeader title="Payment methods" />
          </View>
        }
        ListFooterComponent={
          <View className="mt-6 rounded-[28px] bg-elevated p-5">
            <SectionHeader title="Order summary" />
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="font-body text-sm text-text-secondary">{meal.name}</Text>
                <Text className="font-ui text-sm text-text-primary">{formatCurrency(meal.price)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body text-sm text-text-secondary">{delivery?.label ?? 'Delivery'}</Text>
                <Text className="font-ui text-sm text-text-primary">
                  {formatCurrency(delivery?.fee ?? 0)}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-heading text-xl text-text-primary">Total</Text>
              <Text className="font-heading text-xl text-text-primary">{formatCurrency(total)}</Text>
            </View>
            <ScalePressable className="mt-5 rounded-[24px] bg-accent px-5 py-4">
              <Text className="font-ui text-center text-base text-background">Confirm order</Text>
            </ScalePressable>
          </View>
        }
      />
    </AppScreen>
  );
}
