import { createSelector } from "@reduxjs/toolkit";
import { Contact } from "../../types";
import { RootState } from "../store";

const selectContactsData = (state: RootState) => state.contacts.data;

export const getContacts = createSelector([selectContactsData], (contacts) => {
  const { entities, ids } = contacts;

  return ids.reduce((acc, id) => {
    const asset = entities[id];
    if (asset) {
      return [...acc, asset];
    }
    return acc;
  }, [] as Contact[]);
});
