import * as functions from "firebase-functions";
import axios from "axios";

import { getAuthSession } from "./AuthSession";

const FormData = require("form-data");

const authSession = getAuthSession();

export const createAccount = functions.https.onCall(async (data) => {
  if (
    !(
      data &&
      data.Name &&
      data.FirstName &&
      data.SurName &&
      data.Mail &&
      data.LoginName
    )
  ) {
    throw "missing_params";
  }

  var formData = new FormData();

  const combinedData = { ...defaultAccountData, ...data };

  for (var key in combinedData) {
    formData.append(key, combinedData[key]);
  }

  const { MajorToken, MinorToken } = await authSession.getSession();

  formData.append("MajorToken", MajorToken);
  formData.append("MinorToken", MinorToken);

  const res = await axios.post(
    "https://newapi.quiktrak.co/Quiktrak/V2/Customer/Edit",
    formData,
    {
      params: { MajorToken, MinorToken },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
});

const defaultAccountData = {
  Type: 5,
  SecurityCode: "30029f",
  SubsYearId: "",
  SubsMonthId: "",
  SubsYearPrice: "",
  SubsMonthPrice: "",
  VIN: "",
  Number: "30029f",
  CountryCode: "CAN",
  TimeFormat: "dd/MM/yyyy HH:mm:ss",
  TimeZone: "Pacific Standard Time_-8",
  Language: "en",
  ExtDoaminCode: "ULoc8",
  WebSiteCode: "edc7f914-3212-4f3b-a5e6-494f0d8ec473",
  SpeedUnit: "KPH",
  MobilePhone: "",
  WorkPhone: "",
  AddressInfo1: "",
  AddressInfo2: "",
  AddressInfo3: "",
  AddressInfo4: "",
  AddressInfo5: "",
  PayType: "NONE",
  Controllable: 1,
  AllowCommand: 1,
  ScheduledImmobilzer: 0,
  autoMonthlyReport: 0,
  ActivationDevices: "",
  Alerts: "",
  AEmails: "",
  ActivationEmails: "",
};
