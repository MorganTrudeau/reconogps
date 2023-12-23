import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { listOfEntities } from "./utils";

const selectGeofenceData = (state: RootState) => state.geofences.data;

export const getGeofences = createSelector(
  [selectGeofenceData],
  (geofenceData) => {
    const { entities, ids } = geofenceData;
    return listOfEntities(ids, entities);
  }
);
