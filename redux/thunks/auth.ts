import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthApis from "../../api/auth";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";
import { generateUid } from "../../utils";

export const login = createAsyncThunk(
  "auth/login",
  async (
    { account, password }: { account: string; password: string },
    thunkApi
  ) => {
    const mobileToken =
      (thunkApi.getState() as RootState).auth.mobileToken || generateUid();
    return AuthApis.login(account, password, mobileToken);
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { minorToken } = state.auth;
  const mobileToken = state.auth.mobileToken;
  if (!minorToken) {
    throw Errors.InvalidAuth;
  }
  return AuthApis.logout(minorToken, mobileToken);
});

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
