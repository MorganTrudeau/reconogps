import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Errors } from "../../utils/enums";
import * as NotificationApis from "../../api/notifications";

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
    const { majorToken, minorToken, mobileToken } = state.auth;
    if (majorToken && minorToken && mobileToken && deviceToken) {
      await NotificationApis.registerToken(
        majorToken,
        minorToken,
        mobileToken,
        deviceToken
      );
    }
    return deviceToken;
  }
);
