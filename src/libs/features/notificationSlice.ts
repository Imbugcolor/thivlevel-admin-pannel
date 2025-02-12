// Define the initial state using that type
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationPayload<T> {
  data: T[];
  unreads?: number;
  total: number;
  page: number;
}

export interface NotificationState {
  data: NotificationSchema[];
  unreads: number;
  total: number;
  page: number;
}

const initialState: NotificationState = {
    data: [],
    unreads: 0,
    total: 0,
    page: 1,
};

export const NotificationSlice = createSlice({
  name: "notification",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getNotifications: (
      state,
      action: PayloadAction<NotificationPayload<NotificationSchema>>
    ) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      if (action.payload.unreads) {
        state.unreads = action.payload.unreads
      }
    },
    addNotification: (state, action: PayloadAction<NotificationSchema>) => {
      state.data.unshift(action.payload)
      state.total = state.total + 1;
      state.unreads = state.unreads + 1;
    },
    changeNotificationPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  getNotifications,
  addNotification,
  changeNotificationPage,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;