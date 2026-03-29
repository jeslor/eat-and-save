import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createAppQueryClient } from '@/lib/query/client';
import { TypographyProvider } from '@/components/providers/TypographyProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <SafeAreaProvider>
      <TypographyProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </TypographyProvider>
    </SafeAreaProvider>
  );
}
