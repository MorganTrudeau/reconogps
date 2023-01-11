import { createSelector } from "@reduxjs/toolkit";
import { CustomerTypes } from "../../utils/enums";
import { RootState } from "../store";

const selectUserInfo = (state: RootState) => state.activeUser.data;

export const isAgentOrDealer = createSelector(
  [selectUserInfo],
  (activeUser) => {
    return (
      !!activeUser &&
      (activeUser.CustomerType === CustomerTypes.Agent ||
        activeUser.CustomerType === CustomerTypes.Dealer)
    );
  }
);
