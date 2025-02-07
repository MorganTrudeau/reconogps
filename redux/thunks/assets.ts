import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AssetApis from "../../api/assets";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";
import { EditAssetParams } from "../../types/api";
import { StaticAsset } from "../../types";

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

export const loadStaticAssets = createAsyncThunk(
  "assets/loadStaticAssets",
  (_, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return AssetApis.loadStaticAssets(majorToken, minorToken);
  }
);

export const editAsset = createAsyncThunk(
  "assets/editAsset",
  async (asset: StaticAsset, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    await AssetApis.editAsset(majorToken, minorToken, asset);
    return asset;
  }
);
