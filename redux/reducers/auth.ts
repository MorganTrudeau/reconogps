import { createSlice } from "@reduxjs/toolkit";
import { changePassword, login, logout, refreshToken } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { createTransform } from "redux-persist";

export interface AuthState {
  majorToken: string | null;
  minorToken: string | null;
  deviceToken: string | null;
  account: string | null;
  password: string | null;

  registering: boolean;

  loginRequest: SimpleLoadingState;
  logoutRequest: SimpleLoadingState;
  changePasswordRequest: SimpleLoadingState;
}

const initialState: AuthState = {
  majorToken: null,
  minorToken: null,
  deviceToken: "asdf",
  account: null,
  password: null,

  registering: false,

  loginRequest: IDLE_STATE,
  logoutRequest: IDLE_STATE,
  changePasswordRequest: IDLE_STATE,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startRegistration: (state) => {
      state.registering = true;
    },
    endRegistration: (state) => {
      state.registering = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    createSimpleLoadingState("loginRequest", builder, login);
    builder.addCase(login.fulfilled, (state, action) => {
      state.majorToken = action.payload.data.MajorToken;
      state.minorToken = action.payload.data.MinorToken;
      state.password = action.payload.password;
      state.account = action.payload.account;

      console.log(action.payload);

      state.registering = action.payload.data.AssetArray.length === 0;

      state.loginRequest = SUCCESS_STATE;
    });
    // Change password
    createSimpleLoadingState("changePasswordRequest", builder, changePassword);
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.changePasswordRequest = SUCCESS_STATE;
    });
    // Logout
    createSimpleLoadingState("logoutRequest", builder, logout);
    builder.addCase(logout.fulfilled, (state, action) => {
      state.majorToken = null;
      state.minorToken = null;

      state.logoutRequest = SUCCESS_STATE;
    });
    // Refresh
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.minorToken = action.payload.MinorToken;
    });
  },
});

export const transform = createTransform(
  (state: AuthState) => ({
    ...initialState,
    majorToken: state.majorToken,
    minorToken: state.minorToken,
    deviceToken: state.deviceToken,
    registering: state.registering,
    account: state.account,
    password: state.password,
  }),
  (state: AuthState) => state,
  { whitelist: ["auth"] }
);

export const { startRegistration, endRegistration } = authSlice.actions;

export default authSlice.reducer;
