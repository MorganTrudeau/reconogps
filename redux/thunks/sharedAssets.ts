import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SharedAssetApis from "../../api/sharedAssets";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";

export const loadMySharedAssets = createAsyncThunk(
  "sharedAssets/loadMySharedAssets",
  (_, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.loadMySharedAssets(majorToken, minorToken);
  }
);

export const loadSubscribedAssets = createAsyncThunk(
  "sharedAssets/loadSubscribedAssets",
  (_, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.loadSubscribedAssets(majorToken, minorToken);
  }
);

export const startSharingAsset = createAsyncThunk(
  "sharedAssets/startSharingAsset",
  ({ imei, days }: { imei: string; days: string }, thunkApi) => {
    const { majorToken } = (thunkApi.getState() as RootState).auth;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.startSharingAsset(majorToken, imei, days);
  }
);

export const stopSharingAsset = createAsyncThunk(
  "sharedAssets/stopSharingAsset",
  ({ imei }: { imei: string }, thunkApi) => {
    const { majorToken } = (thunkApi.getState() as RootState).auth;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.stopSharingAsset(majorToken, imei);
  }
);

export const subscribeSharedAsset = createAsyncThunk(
  "sharedAssets/subscribeSharedAsset",
  ({ code }: { code: string }, thunkApi) => {
    const { majorToken } = (thunkApi.getState() as RootState).auth;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.subscribeSharedAsset(majorToken, code);
  }
);

export const unsubscribeSharedAsset = createAsyncThunk(
  "sharedAssets/unsubscribeSharedAsset",
  ({ imei }: { imei: string }, thunkApi) => {
    const { majorToken } = (thunkApi.getState() as RootState).auth;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.unsubscribeSharedAsset(majorToken, imei);
  }
);

export const extendSharedAssetExpiry = createAsyncThunk(
  "sharedAssets/extendSharedAssetExpiry",
  ({ code, days }: { code: string; days: string }, thunkApi) => {
    const { majorToken } = (thunkApi.getState() as RootState).auth;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return SharedAssetApis.extendSharedAssetExpiry(majorToken, code, days);
  }
);
