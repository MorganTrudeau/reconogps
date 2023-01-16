import axios from "axios";
import { API_URL } from "@env";
import { AddContactData, EditContactData } from "../types";
import { validateResponseData } from "./utils";

export const loadContacts = async (majorToken: string) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/User/GetList`, {
    params: { MajorToken: majorToken },
  });

  console.log(res);

  return res.data;
};

export const addContact = async (
  majorToken: string,
  contactData: AddContactData
) => {
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/User/Add`,
    {},
    {
      params: { MajorToken: majorToken, ...contactData },
    }
  );

  validateResponseData(res);

  if (!res.data.Data.User) {
    throw "missing_user";
  }

  return res.data.Data.User;
};

export const editContact = async (
  majorToken: string,
  contactData: EditContactData
) => {
  const { Code, ...editData } = contactData;
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/User/Edit`,
    {},
    {
      params: { MajorToken: majorToken, MinorToken: Code, ...editData },
    }
  );

  validateResponseData(res);

  if (!res.data.Data.User) {
    throw "missing_user";
  }

  return { Code, ...res.data.Data.User };
};

export const deleteContact = async (
  majorToken: string,
  contactCode: string
) => {
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/User/Delete`,
    {},
    {
      params: { MajorToken: majorToken, MinorToken: contactCode },
    }
  );

  validateResponseData(res);

  return contactCode;
};
