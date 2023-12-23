import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { listOfEntities } from "./utils";

const selectMySharedAssets = (state: RootState) =>
  state.sharedAssets.mySharedAssets;
const selectSubscribedAssets = (state: RootState) =>
  state.sharedAssets.subscribedAssets;

export const getMySharedAssets = createSelector(
  [selectMySharedAssets],
  (sharedAssets) => {
    const { entities, ids } = sharedAssets;
    return listOfEntities(ids, entities);
  }
);

export const getSubscribedAssets = createSelector(
  [selectSubscribedAssets],
  (sharedAssets) => {
    const { entities, ids } = sharedAssets;
    return listOfEntities(ids, entities);
  }
);
