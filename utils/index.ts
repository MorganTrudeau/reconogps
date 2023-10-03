import { ReportAlarm, SolutionType } from "../types";
import { IMAGE_URL } from "@env";
import { AlertButton, AlertOptions } from "react-native";
import { SolutionTypes } from "./enums";

export function generateUid(n: number = 9) {
  let S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const randomness = new Array(n).fill(0);

  return randomness.map((_) => S4()).join("");
}

export const roundNumber = (num: number, decimalPlaces: number) => {
  if (decimalPlaces > 0) {
    const places = Math.pow(10, decimalPlaces + 1);
    return Math.round((num + Number.EPSILON) * places) / places;
  } else {
    return Math.round(num);
  }
};

export const errorHasCode = (
  error: unknown
): error is { code: string | number } => {
  return typeof error === "object" && error !== null && "code" in error;
};

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

export const getAlarmName = (type: string | number) => {
  let name = "";
  type = "" + type;
  switch (type) {
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

export const getAlarmListTypeForSolution = (
  solutionType: SolutionType | null | undefined
) => {
  const lowercaseSolution = solutionType?.toLowerCase() as SolutionType;

  if (
    lowercaseSolution === SolutionTypes.track ||
    lowercaseSolution === SolutionTypes.watch ||
    lowercaseSolution === SolutionTypes.life
  ) {
    return 2;
  } else if (lowercaseSolution === SolutionTypes.protect) {
    return 1;
  }

  return 3;
};

const witiAlarmIdsWhiteList = ["8", "1024", "16", "512", "4", "131072"];
const alarmIdsWhiteList = [
  "65536",
  "32768",
  "1048576",
  "131072",
  "1024",
  "8",
  "16",
  "128",
  "512",
  "4",
  "2",
  "256",
  "33554432",
  "2097152",
  "16777216",
];
const emailAlarmIdsWhiteList = [
  "8",
  "1024",
  "16",
  "512",
  "4",
  "131072",
  "1048576",
];

export const filterAlarmIdsForAssetSolution = (
  alarms: string[],
  solution: string
) => {
  if (solution.includes("witi")) {
    return alarms.filter((id) => witiAlarmIdsWhiteList.includes(id));
  } else {
    return alarms.filter((id) => alarmIdsWhiteList.includes(id));
  }
};

export const filterEmailAlarmIdsForAssetSolution = (
  alarms: string[],
  solution: string
) => {
  if (solution.includes("witi")) {
    return alarms.filter((id) => witiAlarmIdsWhiteList.includes(id));
  } else {
    return alarms.filter((id) => emailAlarmIdsWhiteList.includes(id));
  }
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

export const validateNumber = (value: string): boolean =>
  value !== "" && !isNaN(Number(value));
