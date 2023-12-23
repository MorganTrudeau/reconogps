import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { Geofence } from "../../types";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import {
  deleteGeofence,
  loadGeofences,
  toggleGeofenceActive,
} from "../thunks/geofences";
import { createTransform } from "redux-persist";

export interface GeofencesState {
  data: EntityState<Geofence>;
  loadRequest: SimpleLoadingState;
  toggleActive: string | null;
}

const geofencesAdapter = createEntityAdapter<Geofence>({
  selectId: (geofence) => geofence.Code,
});

const initialState: GeofencesState = {
  data: geofencesAdapter.getInitialState(),
  loadRequest: IDLE_STATE,
  toggleActive: null,
};

export const geofencesSlice = createSlice({
  name: "geofences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load
    createSimpleLoadingState("loadRequest", builder, loadGeofences);
    builder.addCase(loadGeofences.fulfilled, (state, action) => {
      geofencesAdapter.setMany(state.data, action.payload);
      state.loadRequest = SUCCESS_STATE;
    });
    builder.addCase(toggleGeofenceActive.pending, (state, action) => {
      state.toggleActive = action.meta.arg.Code;
    });
    builder.addCase(toggleGeofenceActive.fulfilled, (state, action) => {
      geofencesAdapter.setOne(state.data, action.payload);
      state.toggleActive = null;
    });
    builder.addCase(toggleGeofenceActive.rejected, (state, action) => {
      state.toggleActive = null;
    });
    builder.addCase(deleteGeofence.fulfilled, (state, action) => {
      geofencesAdapter.removeOne(state.data, action.payload);
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export const transform = createTransform(
  (state: GeofencesState) => ({
    ...initialState,
    data: state.data,
  }),
  (state: GeofencesState) => state,
  { whitelist: ["geofences"] }
);

export default geofencesSlice.reducer;
