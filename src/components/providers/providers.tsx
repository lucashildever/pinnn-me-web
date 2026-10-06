'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/lib/state/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './auth-provider/AuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
