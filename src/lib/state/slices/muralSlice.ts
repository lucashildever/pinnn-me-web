import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface MuralState {
  activeMuralId: string;
}

const initialState: MuralState = {
  activeMuralId: '',
};

const muralSlice = createSlice({
  name: 'mural',
  initialState,
  reducers: {
    setActiveMuralId: (state, action: PayloadAction<string>) => {
      state.activeMuralId = action.payload;
    },
  },
});

export const { setActiveMuralId } = muralSlice.actions;

export const selectActiveMuralId = (state: RootState): string =>
  state.mural.activeMuralId;

export default muralSlice.reducer;
