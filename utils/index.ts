import { ReportAlarm, StaticAsset, User } from "../types";
import { IMAGE_URL } from "@env";
import { AlertButton, AlertOptions } from "react-native";
import { timeZones } from "./data";

export const constructImageUrl = (image: string) =>
  `${IMAGE_URL}/Attachment/images/${image}?${Date.now()}`;

const errorHasMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

export const errorToMessage = (error: unknown): string => {
  if (errorHasMessage(error)) {
    return error.message;
  } else {
    return "Something went wrong. Please try again.";
  }
};

export const alertGeneralError = (
  Alert: {
    alert: (
      title: string,
      message?: string | undefined,
      buttons?: AlertButton[] | undefined,
      options?: AlertOptions | undefined
    ) => void;
  },
  onConfirm?: () => void
) => {
  Alert.alert(
    "Internal Error",
    "Something went wrong please try again.",
    onConfirm ? [{ text: "OK", onPress: onConfirm }] : undefined
  );
};

const getAlarmName = (type: string) => {
  let name = "";
  type = "" + type;
  switch (type) {
    //case '0':           ret = LANGUAGE.REPORT_ALERT_LIST_MSG01; break; // None
    //case '1':           ret = LANGUAGE.REPORT_ALERT_LIST_MSG02; break; // Custom
    case "2":
      name = "SOS Duress";
      break;
    case "4":
      name = "Power Disconnect";
      break;
    case "8":
      name = "Enter Geofence";
      break;
    case "16":
      name = "Leave Geofence";
      break;
    case "32":
      name = "Speed Alert";
      break;
    case "128":
      name = "Intrusion Alert";
      break;
    case "256":
      name = "Tilt / Shock";
      break;
    case "512":
      name = "Low Battery";
      break;
    case "1024":
      name = "Geolock Alert";
      break;
    case "16384":
      name = "Impact / Crash";
      break;
    case "32768":
      name = "Ignition On";
      break;
    case "65536":
      name = "Ignition Off";
      break;
    case "131072":
      name = "Negative Input";
      break;
    case "1048576":
      name = "Positive Input";
      break;
    case "2097152":
      name = "Harsh Bracking";
      break;
    case "16777216":
      name = "Fatigue Driving";
      break;
    case "33554432":
      name = "Harsh Accelerate";
      break;
  }
  return name;
};

export const mapAlarmsResponse = (alarms: ReportAlarm[]): ReportAlarm[] => {
  return alarms.reduce((acc, alarm) => {
    const name = getAlarmName(alarm.AlertId);
    if (name) {
      return [...acc, { ...alarm, AlertName: name }];
    }
    return acc;
  }, [] as ReportAlarm[]);
};

export const validateEmail = (email: string): boolean => {
  var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return !!email.match(validRegex);
};
