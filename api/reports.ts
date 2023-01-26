import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { ReportParams } from "../types/api";
import {
  Contact,
  Geofence,
  OverviewReportOption,
  ReportAlarm,
  StaticAsset,
} from "../types";
import { validateEmail, validateNumber } from "../utils";
import moment from "moment";
import { Constants } from "../utils/constants";
import { Errors } from "../utils/enums";

export const CreateReportErrors = {
  MISSING_EMAILS: "missing-email",
  MISSING_ASSETS: "missing-assets",
  MISSING_IGNITION_ON_TIME: "missing-ignition-on-time",
  MISSING_IGNITION_OFF_TIME: "missing-ignition-off-time",
  MISSING_STOP_TIME: "missing-stop-time",
};

export const createReport = (
  context: "alarms" | "overview" | "runtime" | "stops" | "trips",
  majorToken: string | null,
  minorToken: string | null,
  contacts: Contact[],
  externalEmail: string,
  dateFrom: Date,
  dateTo: Date,
  assets: StaticAsset[],
  reportOptions: OverviewReportOption[],
  geofences: Geofence[],
  alarms: ReportAlarm[],
  trackingIgnitionOn: boolean,
  ignitionOnTime: string,
  trackingIgnitionOff: boolean,
  ignitionOffTime: string,
  stopTime: string
) => {
  if (!(majorToken && minorToken)) {
    throw Errors.InvalidAuth;
  }

  if (contacts.length === 0 && !validateEmail(externalEmail)) {
    throw CreateReportErrors.MISSING_EMAILS;
  }

  if (assets.length === 0) {
    throw CreateReportErrors.MISSING_ASSETS;
  }

  const IMEIs = assets.map((asset) => asset.imei);
  const AsIds = assets.map((asset) => asset.id);
  const Emails = contacts
    .map((contact) => contact.EMail)
    .filter((email) => email && validateEmail(email)) as string[];
  const Features = reportOptions.map((o) => o.Value);
  const AlertIds = alarms.map((alert) => alert.AlertId);
  const GetGeofenceCodes = geofences.map((geofence) => geofence.Code);
  const DateFrom = moment(dateFrom)
    .utc()
    .format(Constants.MOMENT_API_DATE_FORMAT);
  const DateTo = moment(dateTo).utc().format(Constants.MOMENT_API_DATE_FORMAT);

  if (validateEmail(externalEmail)) {
    Emails.push(externalEmail);
  }

  const params: ReportParams = {
    MajorToken: majorToken,
    MinorToken: minorToken,
    IMEIs,
    Emails,
    Export: "PDF",
    Logo: "https://helper.quiktrak.com.au/logo/quiktrak/logo.png",
    From: DateFrom,
    To: DateTo,
  };

  if (context === "trips") {
    params.DateFrom = DateFrom;
    params.DateTo = DateTo;
    return createTripReport(params);
  } else if (context === "overview") {
    params.Features = Features;
    params.GetGeofenceCodes = GetGeofenceCodes;
    params.Alerts = AlertIds;
    return createOverviewReport(params);
  } else if (context === "alarms") {
    params.AlertIds = AlertIds;
    params.AsIds = AsIds;
    params.DateFrom = DateFrom;
    params.DateTo = DateTo;
    return createAlarmReport(params);
  } else if (context === "runtime") {
    params.DateFrom = DateFrom;
    params.DateTo = DateTo;
    params.EventClass = "2";
    params.EventTypes = [];
    params.EventDurations = [];

    if (trackingIgnitionOff) {
      if (!validateNumber(ignitionOffTime)) {
        throw CreateReportErrors.MISSING_IGNITION_OFF_TIME;
      }

      params.EventTypes.push(0);
      params.EventDurations.push(ignitionOffTime);
    }
    if (trackingIgnitionOn) {
      if (!validateNumber(ignitionOnTime)) {
        throw CreateReportErrors.MISSING_IGNITION_ON_TIME;
      }

      params.EventTypes.push(1);
      params.EventDurations.push(ignitionOnTime);
    }

    return createEventReport(params);
  } else if (context === "stops") {
    if (!stopTime) {
      throw CreateReportErrors.MISSING_STOP_TIME;
    }

    params.DateFrom = DateFrom;
    params.DateTo = DateTo;
    params.EventClass = "4";
    params.EventTypes = "0";
    params.EventDurations = [stopTime];

    return createEventReport(params);
  }
};

export const getReportAlarms = async (
  majorToken: string,
  minorToken: string
) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/Report/GetAlertList`, {
    params: { MajorToken: majorToken, MinorToken: minorToken },
  });

  validateResponseData(res);

  return res.data.Data;
};

const buildReportApi = (url: string) => {
  return async (data: ReportParams) => {
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    validateResponseData(res);

    return res.data.Data;
  };
};

export const createTripReport = buildReportApi(
  `${API_URL}/QuikTrak/V1/Report/GetTripReport`
);

export const createEventReport = buildReportApi(
  `${API_URL}/QuikTrak/V1/Report/GetEventReport`
);

export const createAlarmReport = buildReportApi(
  `${API_URL}/QuikTrak/V1/Report/GetAlertReportData`
);

export const createOverviewReport = buildReportApi(
  `${API_URL}/QuikTrak/V1/Report/GetOverview`
);
