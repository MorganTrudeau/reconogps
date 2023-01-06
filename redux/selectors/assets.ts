import { createSelector } from "@reduxjs/toolkit";
import { StaticAsset } from "../../types";
import { RootState } from "../store";

const selectStaticAssetData = (state: RootState) => state.assets.staticData;

export const getStaticAssets = createSelector(
  [selectStaticAssetData],
  (assetData) => {
    const { entities, ids } = assetData;

    return ids.reduce((acc, id) => {
      const asset = entities[id];
      if (asset) {
        return [...acc, asset];
      }
      return acc;
    }, [] as StaticAsset[]);
  }
);
