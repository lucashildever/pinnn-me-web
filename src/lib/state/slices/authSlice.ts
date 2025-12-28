import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Subscription } from '@/lib/api-client/types/auth';

export interface AuthState {
  token: string;
  subscription: Subscription | null;
}

const initialState: AuthState = {
  token: '',
  subscription: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.subscription = action.payload;
    },
    clearAuth: (state) => {
      state.token = '';
      state.subscription = null;
    },
  },
});

export const { setToken, setSubscription, clearAuth } = authSlice.actions;

export const selectToken = (state: RootState): string => state.auth.token;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.token !== '';
export const selectSubscription = (state: RootState) => state.auth.subscription;
export const selectPlanType = (state: RootState) =>
  state.auth.subscription?.planType;
export const selectLimits = (state: RootState) =>
  state.auth.subscription?.limits;
export const selectFeatures = (state: RootState) =>
  state.auth.subscription?.features;

export default authSlice.reducer;
