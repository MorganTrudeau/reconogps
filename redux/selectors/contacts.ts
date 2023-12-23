import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { listOfEntities } from "./utils";

const selectContactsData = (state: RootState) => state.contacts.data;

export const getContacts = createSelector([selectContactsData], (contacts) => {
  const { entities, ids } = contacts;
  return listOfEntities(ids, entities);
});
