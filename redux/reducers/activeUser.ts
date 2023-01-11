import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { updateUserInfo } from "../thunks/user";
import { Permissions, Permissions2, User } from "../../types";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { createTransform } from "redux-persist";

export interface ActiveUserState {
  data: User | null;
  permissions: Permissions | null;
  permissions2: Permissions2 | null;
  updateRequest: SimpleLoadingState;
}

const initialState: ActiveUserState = {
  data: null,
  permissions: null,
  permissions2: null,
  updateRequest: IDLE_STATE,
};

export const transform = createTransform(
  (state: ActiveUserState) => ({
    ...initialState,
    permissions: state.permissions,
    permissions2: state.permissions2,
    data: state.data,
  }),
  (state: ActiveUserState) => state,
  { whitelist: ["activeUser"] }
);

export const activeUserSlice = createSlice({
  name: "activeUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login data
    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload.UserInfo;
      state.permissions = action.payload.Permissions.split(",").filter(
        (p: string) => !!p
      );
      state.permissions2 = action.payload.Permissions2;
    });
    createSimpleLoadingState("updateRequest", builder, updateUserInfo);
    // Update User Info
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.data = action.payload.user;
      state.permissions2 = action.payload.permissions2;
      state.updateRequest = SUCCESS_STATE;
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export default activeUserSlice.reducer;
