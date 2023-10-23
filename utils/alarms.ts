import { AlarmSettings, AlarmUserConfiguration } from "../types";

const ALL_ALARMS_OFF = 2147483647;

export const getDefaultOfflineAlarmOptions = () => {
  return [
    { name: "24 Hours", id: "24" },
    { name: "48 Hours", id: "48" },
    { name: "72 Hours", id: "72" },
  ];
};

export const getOfflineAlarmOptions = (userConfig?: AlarmUserConfiguration) => {
  const defaultOfflineOptions = getDefaultOfflineAlarmOptions();

  if (!(userConfig && userConfig.OfflineHours)) {
    return [];
  }

  const valuesArr = userConfig.OfflineHours.split(",");

  return defaultOfflineOptions.filter((o) => valuesArr.includes(o.id));
};

export const overspeedAlarmsSupported = (alarmSettings?: AlarmSettings) =>
  !!alarmSettings?.Push && alarmSettings.Push.includes("32");

export const overspeedAlarmsEnabled = (userConfig?: AlarmUserConfiguration) =>
  !!userConfig?.AlertTypes && !(userConfig.AlertTypes & 32);

export const getEnabledAlarmsValue = (allAlarms: number[], alarms: number[]) =>
  ALL_ALARMS_OFF +
  allAlarms
    .filter((a) => !alarms.includes(a))
    .reduce((acc, alarm) => acc + alarm, 0);
