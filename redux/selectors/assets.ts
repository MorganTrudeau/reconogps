import { createSelector } from "@reduxjs/toolkit";
import { CombinedAsset } from "../../types";
import { RootState } from "../store";
import { listOfEntities } from "./utils";

const selectStaticAssetData = (state: RootState) => state.assets.staticData;
const selectDynamicAssetData = (state: RootState) => state.assets.dynamicData;

export const getStaticAssets = createSelector(
  [selectStaticAssetData],
  (assetData) => {
    const { entities, ids } = assetData;
    return listOfEntities(ids, entities);
  }
);

export const getDynamicAssets = createSelector(
  [selectDynamicAssetData],
  (assetData) => {
    const { entities, ids } = assetData;
    return listOfEntities(ids, entities);
  }
);

export const getCombinedAssets = createSelector(
  [selectStaticAssetData, selectDynamicAssetData],
  (staticData, dynamicData) => {
    const { entities: staticEntities, ids: staticIds } = staticData;
    const { entities: dynamicEntities } = dynamicData;

    return staticIds.reduce((acc, id) => {
      const staticAsset = staticEntities[id];
      if (staticAsset) {
        const dynamicAsset = dynamicEntities[staticAsset.id];
        if (dynamicAsset) {
          const combinedAsset: CombinedAsset = {
            staticData: staticAsset,
            dynamicData: dynamicAsset,
          };
          return [...acc, combinedAsset];
        }
      }
      return acc;
    }, [] as CombinedAsset[]);
  }
);
