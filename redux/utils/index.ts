import { AsyncThunk, ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";

export const IDLE_STATE = { loading: false, error: null, success: false };
export const SUCCESS_STATE = { loading: false, error: null, success: true };

export const createSimpleLoadingState = <State>(
  stateKey: keyof State,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<any, any, any>
) => {
  builder.addCase(thunk.pending, (state) => {
    // @ts-ignore
    state[stateKey] = { loading: true, error: null, success: false };
  });
  builder.addCase(thunk.rejected, (state, action) => {
    // @ts-ignore
    state[stateKey] = {
      loading: false,
      // @ts-ignore
      error: action.error?.message || action.error || "general_error",
      success: false,
    };
  });
};

export const resetOnLogout = <State>(
  builder: ActionReducerMapBuilder<State>,
  resetFunc: (state: Draft<State>) => void
) => {
  // builder.addCase(logout.fulfilled, resetFunc);
  builder.addCase(logout.rejected, resetFunc);
};
