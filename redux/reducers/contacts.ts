import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { logout } from "../thunks/auth";
import { Contact } from "../../types";
import { SimpleLoadingState } from "../../types/redux";
import { createSimpleLoadingState, IDLE_STATE, SUCCESS_STATE } from "../utils";
import { createTransform } from "redux-persist";
import {
  addContact,
  deleteContact,
  editContact,
  loadContacts,
} from "../thunks/contacts";

export interface ContactsState {
  data: EntityState<Contact>;

  loadRequest: SimpleLoadingState;
  addContact: SimpleLoadingState;
  deleteRequest: SimpleLoadingState;
}

const contactsAdapter = createEntityAdapter<Contact>({
  selectId: (contact) => contact.Code,
});

const initialState: ContactsState = {
  data: contactsAdapter.getInitialState(),

  loadRequest: IDLE_STATE,
  addContact: IDLE_STATE,
  deleteRequest: IDLE_STATE,
};

export const transform = createTransform(
  (state: ContactsState) => ({
    ...initialState,
    data: state.data,
  }),
  (state: ContactsState) => state,
  { whitelist: ["contacts"] }
);

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load contacts
    createSimpleLoadingState("loadRequest", builder, loadContacts);
    builder.addCase(loadContacts.fulfilled, (state, action) => {
      contactsAdapter.setAll(state.data, action.payload);
      state.loadRequest = SUCCESS_STATE;
    });
    // Add contact
    createSimpleLoadingState("addContact", builder, addContact);
    // Update User Info
    builder.addCase(addContact.fulfilled, (state, action) => {
      contactsAdapter.setOne(state.data, action.payload);
      state.addContact = SUCCESS_STATE;
    });
    // Edit contact
    createSimpleLoadingState("addContact", builder, editContact);
    // Update User Info
    builder.addCase(editContact.fulfilled, (state, action) => {
      contactsAdapter.setOne(state.data, action.payload);
      state.addContact = SUCCESS_STATE;
    });
    // Delete contact
    createSimpleLoadingState("deleteRequest", builder, deleteContact);
    // Update User Info
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      contactsAdapter.removeOne(state.data, action.payload);
      state.deleteRequest = SUCCESS_STATE;
    });
    // Logout reset
    builder.addCase(logout.fulfilled, (state, action) => {
      state = { ...initialState };
    });
  },
});

export default contactsSlice.reducer;
