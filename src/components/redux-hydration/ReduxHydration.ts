'use client';

import { useEffect } from 'react';

import { setToken, setSubscription } from '@/lib/state/slices/authSlice';
import { useAppDispatch } from '@/lib/state/hooks';
import { Subscription } from '@/lib/api-client/types/auth';

export default function ReduxHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedSubscription = localStorage.getItem('subscription');

    if (savedToken) {
      dispatch(setToken(savedToken));
    }
    if (savedSubscription) {
      try {
        const subscription: Subscription = JSON.parse(savedSubscription);
        dispatch(setSubscription(subscription));
      } catch {
        // Invalid JSON, clear corrupted data
        localStorage.removeItem('subscription');
      }
    }
  }, [dispatch]);

  return null;
}
