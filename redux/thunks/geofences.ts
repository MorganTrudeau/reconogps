import { createAsyncThunk } from "@reduxjs/toolkit";
import * as GeofenceApis from "../../api/geofences";
import { Errors } from "../../utils/enums";
import { RootState } from "../store";

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
