import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import muralReducer from './slices/muralSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mural: muralReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Inferred type: {auth: AuthState}
export type AppStore = typeof store;
