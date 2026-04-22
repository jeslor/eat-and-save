import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { getThemeColors, getThemeGradients, getThemeVariables, type ThemeMode } from '@/constants/theme';

type AppSettingsState = {
  themeMode: ThemeMode;
  dailyBriefingEnabled: boolean;
  dealAlertsEnabled: boolean;
  nutritionRemindersEnabled: boolean;
};

type AppSettingsContextValue = AppSettingsState & {
  colors: ReturnType<typeof getThemeColors>;
  gradients: ReturnType<typeof getThemeGradients>;
  setThemeMode: (mode: ThemeMode) => void;
  setDailyBriefingEnabled: (value: boolean) => void;
  setDealAlertsEnabled: (value: boolean) => void;
  setNutritionRemindersEnabled: (value: boolean) => void;
};

const APP_SETTINGS_KEY = 'eat-and-save.app-settings';

const defaultState: AppSettingsState = {
  themeMode: 'dark',
  dailyBriefingEnabled: true,
  dealAlertsEnabled: true,
  nutritionRemindersEnabled: true,
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettingsState>(defaultState);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const storedValue = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (!storedValue || !mounted) {
          return;
        }

        const parsed = JSON.parse(storedValue) as Partial<AppSettingsState>;
        setSettings((current) => ({
          ...current,
          ...parsed,
        }));
      } catch {
        // Keep safe defaults when settings cannot be loaded.
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<AppSettingsContextValue>(() => {
    const colors = getThemeColors(settings.themeMode);
    const gradients = getThemeGradients(settings.themeMode);

    return {
      ...settings,
      colors,
      gradients,
      setThemeMode: (themeMode) => {
        setSettings((current) => ({ ...current, themeMode }));
      },
      setDailyBriefingEnabled: (dailyBriefingEnabled) => {
        setSettings((current) => ({ ...current, dailyBriefingEnabled }));
      },
      setDealAlertsEnabled: (dealAlertsEnabled) => {
        setSettings((current) => ({ ...current, dealAlertsEnabled }));
      },
      setNutritionRemindersEnabled: (nutritionRemindersEnabled) => {
        setSettings((current) => ({ ...current, nutritionRemindersEnabled }));
      },
    };
  }, [settings]);

  return (
    <AppSettingsContext.Provider value={value}>
      <View style={getThemeVariables(settings.themeMode)} className="flex-1 bg-background">
        {children}
      </View>
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used inside AppSettingsProvider.');
  }

  return context;
}
