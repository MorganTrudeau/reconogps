import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { DynamicAsset, StaticAsset } from "../../types";
import { mapArrayOfAssetArrays } from "../../utils/assets";
import { loadDynamicAssets, loadStaticAssets } from "../thunks/assets";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { createTransform } from "redux-persist";

export interface AssetsState {
  staticData: EntityState<StaticAsset>;
  dynamicData: EntityState<DynamicAsset>;
  staticLoadRequest: SimpleLoadingState;
}

const staticAssetsAdapter = createEntityAdapter<StaticAsset>();
const dynamicAssetsAdapter = createEntityAdapter<DynamicAsset>();

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
      const staticAssets = mapArrayOfAssetArrays(action.payload.AssetArray);
      staticAssetsAdapter.setAll(state.staticData, staticAssets);
    });
    // Load Static
    createSimpleLoadingState("staticLoadRequest", builder, loadStaticAssets);
    builder.addCase(loadStaticAssets.fulfilled, (state, action) => {
      // const staticAssets = mapArrayOfAssetArrays(action.payload);
      // staticAssetsAdapter.setAll(state.staticData, action.payload);
      state.staticLoadRequest = SUCCESS_STATE;
    });
    // Load Dynamic
    builder.addCase(loadDynamicAssets.fulfilled, (state, action) => {
      const dynamicAssets = mapArrayOfAssetArrays(action.payload);
      dynamicAssetsAdapter.setAll(state.dynamicData, dynamicAssets);
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
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
