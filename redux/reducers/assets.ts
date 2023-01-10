import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { DynamicAsset, StaticAsset } from "../../types";
import { mapArrayOfAssetArrays } from "../../utils/assets";
import { loadDynamicAssets } from "../thunks/assets";
import { IDLE_STATE } from "../utils";

export interface AssetsState {
  staticData: EntityState<StaticAsset>;
  dynamicData: EntityState<DynamicAsset>;
  loadRequest: SimpleLoadingState;
}

const staticAssetsAdapter = createEntityAdapter<StaticAsset>();
const dynamicAssetsAdapter = createEntityAdapter<DynamicAsset>();

const initialState: AssetsState = {
  staticData: staticAssetsAdapter.getInitialState(),
  dynamicData: dynamicAssetsAdapter.getInitialState(),
  loadRequest: IDLE_STATE,
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

export default assetsSlice.reducer;
