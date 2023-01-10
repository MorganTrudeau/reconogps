import { createAsyncThunk } from "@reduxjs/toolkit";
import * as UserApis from "../../api/user";
import { Errors } from "../../api/utils";
import { User } from "../../types";
import { RootState } from "../store";

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  (update: Partial<User>, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return UserApis.updateUserInfo(majorToken, minorToken, update);
  }
);
