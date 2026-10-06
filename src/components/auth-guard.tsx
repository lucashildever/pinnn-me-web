'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/auth-provider/AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard protects routes by checking authentication status.
 * Redirects to login if user is not authenticated.
 * Shows loading state while checking authentication.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
