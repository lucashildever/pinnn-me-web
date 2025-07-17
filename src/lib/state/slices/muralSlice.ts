import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface muralState {
  id: string;
}

const initialState: muralState = {
  id: "",
};

const muralSlice = createSlice({
  name: "mural",
  initialState,
  reducers: {
    setMuralId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setMuralId } = muralSlice.actions;

export const selectMuralId = (state: RootState): string => state.mural.id;

export default muralSlice.reducer;
