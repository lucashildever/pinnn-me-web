'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/state/hooks';
import { setActiveMuralId } from '@/lib/state/slices/muralSlice';
import { apiClient } from '@/lib/api-client/apiClient';

interface AuthProviderProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthProvider validates the user's token on mount and hydrates Redux state.
 * If validation fails, redirects to login page.
 * Renders children only when authentication is confirmed.
 */
export default function AuthProvider({
  children,
  redirectTo = '/login',
}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateAndHydrate = async () => {
      const result = await apiClient.auth.validateToken();

      if (result.success) {
        dispatch(setActiveMuralId(result.data.user.activeMuralId));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        router.replace(redirectTo);
      }
    };

    validateAndHydrate();
  }, [dispatch, router, redirectTo]);

  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}
