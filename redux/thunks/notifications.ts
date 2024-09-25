import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Errors } from "../../utils/enums";
import * as NotificationApis from "../../api/notifications";
import { login } from "../../api/auth";

export const loadNotifications = createAsyncThunk(
  "notifications/load",
  (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const { majorToken, minorToken } = state.auth;
    const deviceToken = state.notifications.deviceToken;
    if (!(majorToken && minorToken && deviceToken)) {
      throw Errors.InvalidAuth;
    }
    return NotificationApis.loadNotifications(minorToken, deviceToken);
  }
);

export const registerToken = createAsyncThunk(
  "notifications/registerToken",
  async (deviceToken: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const { password, account } = state.auth;
    if (account && password && deviceToken) {
      await login(account, password, deviceToken);
    }
    return deviceToken;
  }
);
