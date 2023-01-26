import { createSelector } from "@reduxjs/toolkit";
import { Geofence } from "../../types";
import { RootState } from "../store";

const selectGeofenceData = (state: RootState) => state.geofences.data;

export const getGeofences = createSelector([selectGeofenceData], (contacts) => {
  const { entities, ids } = contacts;

  return ids.reduce((acc, id) => {
    const asset = entities[id];
    if (asset) {
      return [...acc, asset];
    }
    return acc;
  }, [] as Geofence[]);
});
