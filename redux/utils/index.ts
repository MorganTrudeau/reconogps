import { AsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { SimpleLoadingState } from "../../types/redux";

export const createSimpleLoadingState = <State>(
  stateKey: string,
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<any, any, any>
) => {
  builder.addCase(thunk.pending, (state) => {
    // @ts-ignore
    state[stateKey] = { loading: true, error: null };
  });
  builder.addCase(thunk.rejected, (state, action) => {
    // @ts-ignore
    state[stateKey] = { loading: false, error: action.error };
  });
};
