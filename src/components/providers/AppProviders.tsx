import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createAppQueryClient } from '@/lib/query/client';
import { AppSettingsProvider } from '@/components/providers/AppSettingsProvider';
import { TypographyProvider } from '@/components/providers/TypographyProvider';
import { AuthSessionProvider } from '@/features/auth/AuthSessionProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <TypographyProvider>
          <QueryClientProvider client={queryClient}>
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </QueryClientProvider>
        </TypographyProvider>
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}
