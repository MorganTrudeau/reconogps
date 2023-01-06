import { createSlice } from "@reduxjs/toolkit";
import { login, logout, refreshToken } from "../thunks/auth";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState } from "../utils";

export interface AuthState {
  majorToken: string | null;
  minorToken: string | null;
  deviceToken: string | null;

  loginRequest: SimpleLoadingState;
  logoutRequest: SimpleLoadingState;
}

const initialState: AuthState = {
  majorToken: null,
  minorToken: null,
  deviceToken: "asdf",

  loginRequest: { error: null, loading: false },
  logoutRequest: { error: null, loading: false },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    createSimpleLoadingState("loginRequest", builder, login);
    builder.addCase(login.fulfilled, (state, action) => {
      state.majorToken = action.payload.MajorToken;
      state.minorToken = action.payload.MinorToken;

      state.loginRequest = { error: null, loading: false };
    });
    // Logout
    createSimpleLoadingState("logoutRequest", builder, logout);
    builder.addCase(logout.fulfilled, (state, action) => {
      state.majorToken = null;
      state.minorToken = null;

      state.logoutRequest = { error: null, loading: false };
    });
    // Refresh
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.minorToken = action.payload.MinorToken;
    });
  },
});

export default authSlice.reducer;
