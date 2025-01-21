import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { Notification } from "../../types";
import { createTransform } from "redux-persist";
import { loadNotifications, registerToken } from "../thunks/notifications";
import { resetOnLogout } from "../utils";

export interface NotificationsState {
  deviceToken: string;
  data: Notification[];
  unreadCount: 0;
}

const initialState: NotificationsState = {
  deviceToken: "",
  data: [],
  unreadCount: 0,
};

type CachedState = Pick<NotificationsState, "data" | "unreadCount">;
export const transform = createTransform(
  (state: CachedState) => ({
    unreadCount: state.unreadCount,
    data: state.data,
  }),
  (state: CachedState) => ({ ...initialState, ...state }),
  { whitelist: ["notifications"] }
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login data
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      state.data = action.payload.map((n: string) => JSON.parse(n));
    });
    // Logout reset
    resetOnLogout(builder, (state) => {
      state = { ...initialState };
    });
    builder.addCase(registerToken.fulfilled, (state, action) => {
      state.deviceToken = action.payload;
    });
  },
});

export const { setDeviceToken } = notificationsSlice.actions;

export default notificationsSlice.reducer;
