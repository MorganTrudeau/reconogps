import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { StaticAsset } from "../../types";
import { mapArrayOfAssetArrays } from "../../utils/assets";

export interface AuthState {
  staticData: EntityState<StaticAsset>;
  loadRequest: SimpleLoadingState;
}

const assetsAdapter = createEntityAdapter<StaticAsset>();

const initialState: AuthState = {
  staticData: assetsAdapter.getInitialState(),
  loadRequest: { error: null, loading: false },
};

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login data
    builder.addCase(login.fulfilled, (state, action) => {
      const staticAssets = mapArrayOfAssetArrays(action.payload.AssetArray);
      assetsAdapter.setAll(state.staticData, staticAssets);
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = assetsSlice.actions;

export default assetsSlice.reducer;
