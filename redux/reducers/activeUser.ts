import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../thunks/auth";
import { updateUserInfo } from "../thunks/user";
import { User } from "../../types";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { createTransform } from "redux-persist";

export interface ActiveUserState {
  data: User | null;

  updateRequest: SimpleLoadingState;
}

const initialState: ActiveUserState = {
  data: null,

  updateRequest: IDLE_STATE,
};

export const transform = createTransform(
  (state: ActiveUserState) => ({
    ...initialState,
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
    });
    createSimpleLoadingState("updateRequest", builder, updateUserInfo);
    // Update User Info
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.data = action.payload;
      state.updateRequest = SUCCESS_STATE;
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export default activeUserSlice.reducer;
