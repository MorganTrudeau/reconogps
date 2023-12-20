import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { Notification } from "../../types";
import { createTransform } from "redux-persist";
import { loadNotifications } from "../thunks/notifications";

export interface NotificationsState {
  data: Notification[];
  unreadCount: 0;
}

const initialState: NotificationsState = {
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
  reducers: {},
  extraReducers: (builder) => {
    // Login data
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      state.data = action.payload.map((n: string) => JSON.parse(n));
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export default notificationsSlice.reducer;
