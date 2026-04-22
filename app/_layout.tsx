import "react-native-url-polyfill/auto";
import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProviders } from "@/components/providers/AppProviders";
import { useAppSettings } from "@/components/providers/AppSettingsProvider";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { colors, themeMode } = useAppSettings();

  return (
    <>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recommendations/index"
          options={{ title: "Daily picks" }}
        />
        <Stack.Screen name="meals/index" options={{ title: "Meals" }} />
        <Stack.Screen
          name="meals/[mealId]"
          options={{ title: "Meal details", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="auth/index"
          options={{
            title: "Sign in",
            headerBackVisible: true,
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen name="search/index" options={{ title: "Search meals" }} />
        <Stack.Screen name="favorites/index" options={{ title: "Favorites" }} />
        <Stack.Screen
          name="savings/index"
          options={{ title: "Savings insights" }}
        />
        <Stack.Screen
          name="history/index"
          options={{ title: "Meal history" }}
        />
        <Stack.Screen name="recipe/[mealId]" options={{ title: "Recipe" }} />
        <Stack.Screen
          name="notifications/index"
          options={{
            title: "Notifications",
            headerBackVisible: true,
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen name="checkout/index" options={{ title: "Checkout" }} />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </>
  );
}
