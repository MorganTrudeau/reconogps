import { createAsyncThunk } from "@reduxjs/toolkit";
import * as ContactsApis from "../../api/contacts";
import { Errors } from "../../api/utils";
import { AddContactData, EditContactData } from "../../types";
import { RootState } from "../store";

export const loadContacts = createAsyncThunk(
  "contacts/loadContacts",
  (_, thunkApi) => {
    const majorToken = (thunkApi.getState() as RootState).auth.majorToken;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return ContactsApis.loadContacts(majorToken);
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  (contactData: AddContactData, thunkApi) => {
    const majorToken = (thunkApi.getState() as RootState).auth.majorToken;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return ContactsApis.addContact(majorToken, contactData);
  }
);

export const editContact = createAsyncThunk(
  "contacts/editContact",
  (contactData: EditContactData, thunkApi) => {
    const majorToken = (thunkApi.getState() as RootState).auth.majorToken;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return ContactsApis.editContact(majorToken, contactData);
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  (contactCode: string, thunkApi) => {
    const majorToken = (thunkApi.getState() as RootState).auth.majorToken;
    if (!majorToken) {
      throw Errors.InvalidAuth;
    }
    return ContactsApis.deleteContact(majorToken, contactCode);
  }
);
