import { createAsyncThunk } from "@reduxjs/toolkit";
import * as UserApis from "../../api/user";
import { Errors } from "../../utils/enums";
import { Permissions2, User } from "../../types";
import { RootState } from "../store";

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  (
    {
      update,
      permissions2,
    }: { update: Partial<User>; permissions2: Permissions2 },
    thunkApi
  ) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return UserApis.updateUserInfo(majorToken, minorToken, update, permissions2);
  }
);
