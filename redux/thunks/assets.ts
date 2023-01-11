import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AssetApis from "../../api/assets";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";

export const loadDynamicAssets = createAsyncThunk(
  "assets/loadDynamicAssets",
  (
    {
      ids,
    }: {
      ids: string[];
    },
    thunkApi
  ) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return AssetApis.loadDynamicAssets(majorToken, minorToken, ids);
  }
);
