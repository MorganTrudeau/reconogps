import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { DynamicAsset, StaticAsset } from "../../types";
import { mapArrayOfAssetArrays, mapAssetArray } from "../../utils/assets";
import {
  editAsset,
  loadDynamicAssets,
  loadStaticAssets,
} from "../thunks/assets";
import {
  createSimpleLoadingState,
  IDLE_STATE,
  resetOnLogout,
  SUCCESS_STATE,
} from "../utils";
import { createTransform } from "redux-persist";

export interface AssetsState {
  staticData: EntityState<StaticAsset, string>;
  dynamicData: EntityState<DynamicAsset, string>;
  staticLoadRequest: SimpleLoadingState;
}

const staticAssetsAdapter = createEntityAdapter({
  selectId: (asset: StaticAsset) => asset.id,
});
const dynamicAssetsAdapter = createEntityAdapter({
  selectId: (asset: DynamicAsset) => asset.id,
});

const initialState: AssetsState = {
  staticData: staticAssetsAdapter.getInitialState(),
  dynamicData: dynamicAssetsAdapter.getInitialState(),
  staticLoadRequest: IDLE_STATE,
};

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login data
    builder.addCase(login.fulfilled, (state, action) => {
      const staticAssets = mapArrayOfAssetArrays(
        action.payload.data.AssetArray
      );
      staticAssetsAdapter.setAll(state.staticData, staticAssets);
    });
    // Load Static
    createSimpleLoadingState("staticLoadRequest", builder, loadStaticAssets);
    builder.addCase(loadStaticAssets.fulfilled, (state, action) => {
      // const staticAssets = mapArrayOfAssetArrays(action.payload);
      // staticAssetsAdapter.setAll(state.staticData, action.payload);
      state.staticLoadRequest = SUCCESS_STATE;
    });
    builder.addCase(editAsset.fulfilled, (state, action) => {
      // const staticAssets = mapArrayOfAssetArrays(action.payload);
      // staticAssetsAdapter.setAll(state.staticData, action.payload);
      state.staticLoadRequest = SUCCESS_STATE;
      staticAssetsAdapter.setOne(state.staticData, action.payload);
    });
    // Load Dynamic
    builder.addCase(loadDynamicAssets.fulfilled, (state, action) => {
      dynamicAssetsAdapter.setAll(state.dynamicData, action.payload);
    });
    // Logout reset
    resetOnLogout(builder, (state) => {
      state = { ...initialState };
    });
  },
});

export const transform = createTransform(
  (state: AssetsState) => ({
    ...initialState,
    staticData: state.staticData,
  }),
  (state: AssetsState) => state,
  { whitelist: ["assets"] }
);

export default assetsSlice.reducer;
