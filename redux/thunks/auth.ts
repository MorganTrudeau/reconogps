import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthApis from "../../api/auth";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";

export const login = createAsyncThunk(
  "auth/login",
  async ({ account, password }: { account: string; password: string }) => {
    return AuthApis.login(account, password);
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  const { minorToken, deviceToken } = (thunkApi.getState() as RootState).auth;
  if (!(deviceToken && minorToken)) {
    throw Errors.InvalidAuth;
  }
  return AuthApis.logout(minorToken, deviceToken);
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  (_, thunkApi) => {
    const { majorToken, minorToken, deviceToken } = (
      thunkApi.getState() as RootState
    ).auth;
    if (!(majorToken && minorToken && deviceToken)) {
      throw Errors.InvalidAuth;
    }
    return AuthApis.refreshToken(majorToken, minorToken, deviceToken);
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    thunkApi
  ) => {
    const { minorToken } = (thunkApi.getState() as RootState).auth;
    if (!minorToken) {
      throw Errors.InvalidAuth;
    }
    return AuthApis.changePassword(minorToken, oldPassword, newPassword);
  }
);
