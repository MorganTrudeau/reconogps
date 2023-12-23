import { createAsyncThunk } from "@reduxjs/toolkit";
import * as GeofenceApis from "../../api/geofences";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";
import { EditGeofenceParams } from "../../types/api";
import { Geofence } from "../../types";

export const loadGeofences = createAsyncThunk(
  "geofences/loadGeofences",
  (_, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    return GeofenceApis.loadGeofences(majorToken, minorToken);
  }
);

export const addGeofence = createAsyncThunk(
  "geofences/addGeofence",
  async (
    data: Omit<EditGeofenceParams, "MajorToken" | "MinorToken">,
    thunkApi
  ) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    await GeofenceApis.addGeofence({
      MajorToken: majorToken,
      MinorToken: minorToken,
      ...data,
    });
    thunkApi.dispatch(loadGeofences());
  }
);

export const editGeofence = createAsyncThunk(
  "geofences/editGeofence",
  async (
    data: Omit<EditGeofenceParams, "MajorToken" | "MinorToken">,
    thunkApi
  ) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }
    await GeofenceApis.editGeofence({
      MajorToken: majorToken,
      MinorToken: minorToken,
      ...data,
    });
    thunkApi.dispatch(loadGeofences());
  }
);

export const deleteGeofence = createAsyncThunk(
  "geofences/deleteGeofence",
  async ({ code }: { code: string }, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;
    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }

    await GeofenceApis.deleteGeofence({
      MajorToken: majorToken,
      MinorToken: minorToken,
      Code: code,
    });

    return code;
  }
);

export const toggleGeofenceActive = createAsyncThunk(
  "geofences/toggleGeofenceActive",
  async (geofence: Geofence, thunkApi) => {
    const { majorToken, minorToken } = (thunkApi.getState() as RootState).auth;

    if (!(majorToken && minorToken)) {
      throw Errors.InvalidAuth;
    }

    const newState: Geofence["State"] = geofence.State === 1 ? 0 : 1;

    await GeofenceApis.editGeofence({
      MajorToken: majorToken,
      MinorToken: minorToken,
      Code: geofence.Code,
      AlertConfigState: newState,

      Lat: geofence.Lat,
      Lng: geofence.Lng,
      Radius: geofence.Radius,
      GeoType: geofence.GeoType,

      Name: geofence.Name,
      Alerts: geofence.Alerts === 24 ? "8,16" : geofence.Alerts.toString(),
      Address: geofence.Address,
      AssetCodes: geofence.SelectedAssetList.map((a) => a.AsCode).toString(),
      ContactCodes: geofence.ContactList.map((c) => c.Code).toString(),
      Share: geofence.Share,

      Inverse: geofence.Inverse,
      BeginTime: geofence.BeginTime,
      EndTime: geofence.EndTime,
      DelayTime: 0 as 0,
      CycleType: 3 as 3, // NONE = 0, TIME = 1, DATE = 2, WEEK = 3
      Days: geofence.Week.map((w) => w.Week).toString(),

      InSpeedLimit: 0,
      RelayTime: 30,
      Relay: 0,
      GeoPolygon: geofence.GeoPolygon,
    });

    return { ...geofence, State: newState };
  }
);
