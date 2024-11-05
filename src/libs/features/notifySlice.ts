// Define the initial state using that type

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotifyState {
  success?: string,
  error?: string,
  loading?: boolean,
}

const initialState: NotifyState = {
    loading: false
};

export const NotifySlice = createSlice({
  name: "notify",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setNotify: (state, action: PayloadAction<NotifyState>) => {
        if (action.payload.success) {
            state.success = action.payload.success;
            state.error = ''
            state.loading = false
        }

        if (action.payload.error) {
            state.error = action.payload.error;
            state.success = ''
            state.loading = false
        }

        if (action.payload.loading) {
            state.loading = action.payload.loading;
            state.error = ''
            state.success = ''
        }
    },
    removeNotify: (state) => {
        state.error = ''
        state.success = ''
        state.loading = false
    }
  },
});

export const { setNotify, removeNotify } = NotifySlice.actions;

export default NotifySlice.reducer;