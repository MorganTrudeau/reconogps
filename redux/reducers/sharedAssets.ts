import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { SharedAsset } from "../../types";
import { IDLE_STATE, SUCCESS_STATE, createSimpleLoadingState } from "../utils";
import {
  extendSharedAssetExpiry,
  loadMySharedAssets,
  loadSubscribedAssets,
  startSharingAsset,
  stopSharingAsset,
  subscribeSharedAsset,
  unsubscribeSharedAsset,
} from "../thunks/sharedAssets";

export interface SharedAssetsState {
  mySharedAssets: EntityState<SharedAsset>;
  subscribedAssets: EntityState<SharedAsset>;
  loadMySharedAssetsRequest: SimpleLoadingState;
  loadSubscribedAssetsRequest: SimpleLoadingState;
  startSharingAssetRequest: SimpleLoadingState;
  stopSharingAssetRequest: SimpleLoadingState;
  subscribeSharedAssetRequest: SimpleLoadingState;
  unsubscribeSharedAssetRequest: SimpleLoadingState;
  extendExpiryRequest: SimpleLoadingState;
}

const sharedAssetsAdapter = createEntityAdapter<SharedAsset>({
  selectId: (sharedAsset) => sharedAsset.Code,
});

const initialState: SharedAssetsState = {
  mySharedAssets: sharedAssetsAdapter.getInitialState(),
  subscribedAssets: sharedAssetsAdapter.getInitialState(),
  loadMySharedAssetsRequest: IDLE_STATE,
  loadSubscribedAssetsRequest: IDLE_STATE,
  startSharingAssetRequest: IDLE_STATE,
  stopSharingAssetRequest: IDLE_STATE,
  subscribeSharedAssetRequest: IDLE_STATE,
  unsubscribeSharedAssetRequest: IDLE_STATE,
  extendExpiryRequest: IDLE_STATE,
};

export const sharedAssetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load shared assets
    createSimpleLoadingState(
      "loadMySharedAssetsRequest",
      builder,
      loadMySharedAssets
    );
    builder.addCase(loadMySharedAssets.fulfilled, (state, action) => {
      sharedAssetsAdapter.setAll(state.mySharedAssets, action.payload);
      state.loadMySharedAssetsRequest = SUCCESS_STATE;
    });
    // Start sharing asset
    createSimpleLoadingState(
      "startSharingAssetRequest",
      builder,
      startSharingAsset
    );
    builder.addCase(startSharingAsset.fulfilled, (state, action) => {
      sharedAssetsAdapter.setOne(state.mySharedAssets, action.payload);
      state.startSharingAssetRequest = SUCCESS_STATE;
    });
    // Stop sharing asset
    createSimpleLoadingState(
      "stopSharingAssetRequest",
      builder,
      stopSharingAsset
    );
    builder.addCase(stopSharingAsset.fulfilled, (state, action) => {
      sharedAssetsAdapter.removeOne(state.mySharedAssets, action.payload.Code);
      state.stopSharingAssetRequest = SUCCESS_STATE;
    });
    // Subscribe
    createSimpleLoadingState(
      "subscribeSharedAssetRequest",
      builder,
      subscribeSharedAsset
    );
    builder.addCase(subscribeSharedAsset.fulfilled, (state, action) => {
      sharedAssetsAdapter.addOne(
        state.subscribedAssets,
        action.payload.ShareInfo
      );
      state.subscribeSharedAssetRequest = SUCCESS_STATE;
    });
    // Unsubscribe
    createSimpleLoadingState(
      "unsubscribeSharedAssetRequest",
      builder,
      unsubscribeSharedAsset
    );
    builder.addCase(unsubscribeSharedAsset.fulfilled, (state, action) => {
      sharedAssetsAdapter.removeOne(
        state.subscribedAssets,
        action.payload.Code
      );
      state.unsubscribeSharedAssetRequest = SUCCESS_STATE;
    });
    // Extend Expiry
    createSimpleLoadingState(
      "extendExpiryRequest",
      builder,
      extendSharedAssetExpiry
    );
    builder.addCase(extendSharedAssetExpiry.fulfilled, (state, action) => {
      sharedAssetsAdapter.setOne(state.mySharedAssets, action.payload);
      state.extendExpiryRequest = SUCCESS_STATE;
    });
    // Load subscribed assets
    createSimpleLoadingState(
      "loadSubscribedAssetsRequest",
      builder,
      loadSubscribedAssets
    );
    builder.addCase(loadSubscribedAssets.fulfilled, (state, action) => {
      sharedAssetsAdapter.setAll(state.subscribedAssets, action.payload);
      state.loadSubscribedAssetsRequest = SUCCESS_STATE;
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export default sharedAssetsSlice.reducer;
