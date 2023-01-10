import { AsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";

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
    state[stateKey] = { loading: false, error: action.error, success: false };
  });
};
