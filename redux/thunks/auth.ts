import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthApis from "../../api/auth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ account, password }: { account: string; password: string }) => {
    return AuthApis.login(account, password);
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async ({
    minorToken,
    deviceToken,
  }: {
    minorToken: string;
    deviceToken: string;
  }) => {
    return AuthApis.logout(minorToken, deviceToken);
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async ({
    majorToken,
    minorToken,
    deviceToken,
  }: {
    majorToken: string;
    minorToken: string;
    deviceToken: string;
  }) => {
    return AuthApis.refreshToken(majorToken, minorToken, deviceToken);
  }
);
