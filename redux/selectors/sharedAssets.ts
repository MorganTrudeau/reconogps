import { createSelector } from "@reduxjs/toolkit";
import { SharedAsset, StaticAsset } from "../../types";
import { RootState } from "../store";

const selectMySharedAssets = (state: RootState) =>
  state.sharedAssets.mySharedAssets;
const selectSubscribedAssets = (state: RootState) =>
  state.sharedAssets.subscribedAssets;

export const getMySharedAssets = createSelector(
  [selectMySharedAssets],
  (sharedAssets) => {
    const { entities, ids } = sharedAssets;

    return ids.reduce((acc, id) => {
      const asset = entities[id];
      if (asset) {
        return [...acc, asset];
      }
      return acc;
    }, [] as SharedAsset[]);
  }
);

export const getSubscribedAssets = createSelector(
  [selectSubscribedAssets],
  (sharedAssets) => {
    const { entities, ids } = sharedAssets;

    return ids.reduce((acc, id) => {
      const asset = entities[id];
      if (asset) {
        return [...acc, asset];
      }
      return acc;
    }, [] as SharedAsset[]);
  }
);
