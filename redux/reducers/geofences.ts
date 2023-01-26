import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { Geofence } from "../../types";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { loadGeofences } from "../thunks/geofences";
import { createTransform } from "redux-persist";

export interface GeofencesState {
  data: EntityState<Geofence>;

  loadRequest: SimpleLoadingState;
}

const geofencesAdapter = createEntityAdapter<Geofence>({
  selectId: (contact) => contact.Code,
});

const initialState: GeofencesState = {
  data: geofencesAdapter.getInitialState(),

  loadRequest: IDLE_STATE,
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
