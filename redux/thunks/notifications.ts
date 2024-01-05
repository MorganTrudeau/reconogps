import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Errors } from "../../utils/enums";
import * as NotificationApis from "../../api/notifications";

export const loadNotifications = createAsyncThunk(
  "notifications/load",
  (_, thunkApi) => {
    const { majorToken, minorToken, deviceToken } = (
      thunkApi.getState() as RootState
    ).auth;
    if (!(majorToken && minorToken && deviceToken)) {
      throw Errors.InvalidAuth;
    }
    return NotificationApis.loadNotifications(minorToken, deviceToken);
  }
);
