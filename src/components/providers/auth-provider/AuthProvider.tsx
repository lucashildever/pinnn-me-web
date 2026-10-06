'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/state/hooks';
import {
  setToken,
  setSubscription,
  clearAuth,
} from '@/lib/state/slices/authSlice';
import { setActiveMuralId } from '@/lib/state/slices/muralSlice';
import { apiClient } from '@/lib/api-client/apiClient';
import { AuthCredentials, AuthUser } from '@/lib/api-client/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  SignIn: (credentials: AuthCredentials) => Promise<void>;
  SignOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider manages global authentication state and provides auth methods.
 * Handles token hydration, automatic refresh, and integrates with Redux state.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  /**
   * Initialize auth state on mount
   * Attempts to validate existing tokens or refresh if needed
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Safety check for SSR
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!token && !refreshToken) {
        setIsLoading(false);
        return;
      }

      // Try to validate current token
      if (token) {
        const result = await apiClient.auth.validateToken();

        if (result.success) {
          setUser(result.data.user);
          dispatch(setActiveMuralId(result.data.user.activeMuralId));

          // Restore subscription from localStorage if available
          const storedSubscription = localStorage.getItem('subscription');
          if (storedSubscription) {
            try {
              const subscription = JSON.parse(storedSubscription);
              dispatch(setSubscription(subscription));
            } catch (error) {
              console.error('Failed to parse stored subscription:', error);
            }
          }

          setIsLoading(false);
          return;
        }
      }

      // Token validation failed, try refresh
      if (refreshToken) {
        const refreshResult = await apiClient.auth.refresh(refreshToken);

        if (refreshResult.success) {
          localStorage.setItem('token', refreshResult.data.access_token);
          localStorage.setItem(
            'refresh_token',
            refreshResult.data.refresh_token,
          );
          dispatch(setToken(refreshResult.data.access_token));

          if (refreshResult.data.subscription) {
            localStorage.setItem(
              'subscription',
              JSON.stringify(refreshResult.data.subscription),
            );
            dispatch(setSubscription(refreshResult.data.subscription));
          }

          // Validate the new token to get user data
          const validateResult = await apiClient.auth.validateToken();
          if (validateResult.success) {
            setUser(validateResult.data.user);
            dispatch(setActiveMuralId(validateResult.data.user.activeMuralId));
          }
        } else {
          // Refresh failed, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('subscription');
          dispatch(clearAuth());
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  /**
   * Sign in with email and password
   */
  const SignIn = async (credentials: AuthCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await apiClient.auth.login(credentials);

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Store tokens
      localStorage.setItem('token', result.data.access_token);
      localStorage.setItem('refresh_token', result.data.refresh_token);

      const subscription = result.data.subscription ?? null;
      if (subscription) {
        localStorage.setItem('subscription', JSON.stringify(subscription));
      } else {
        localStorage.removeItem('subscription');
      }

      // Update Redux state
      dispatch(setToken(result.data.access_token));
      dispatch(setSubscription(subscription));
      dispatch(setActiveMuralId(result.data.user.activeMuralId));

      // Update local state
      setUser(result.data.user);

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out and revoke refresh token
   */
  const SignOut = async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    const refreshToken = localStorage.getItem('refresh_token');

    // Call logout endpoint to revoke refresh token
    if (refreshToken) {
      try {
        await apiClient.auth.logout(refreshToken);
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local cleanup even if API call fails
      }
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('subscription');

    // Clear Redux state
    dispatch(clearAuth());

    // Clear local state
    setUser(null);

    // Redirect to login
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    SignIn,
    SignOut,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
