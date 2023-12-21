import moment from "moment";
import { Geofence, WeekDayId } from "../types";

export const geofenceAlertName = (alert: number) => {
  if (alert === 8) {
    return "In";
  } else if (alert === 16) {
    return "Out";
  } else if (alert === 24) {
    return "In, Out";
  } else {
    return "";
  }
};

export const getInitialGeofenceIgnoreBetweenState = (geofence: Geofence) => {
  if (geofence.Week.length) {
    const weekday = geofence.Week[0];
    const startTimeSplit = weekday.BeginTime.split(":").map((n) => Number(n));
    const endTimeSplit = weekday.EndTime.split(":").map((n) => Number(n));

    return {
      enabled: !!geofence.Week.length,
      from: moment
        .utc()
        .hour(startTimeSplit[0])
        .minute(startTimeSplit[1])
        .toDate(),
      to: moment.utc().hour(endTimeSplit[0]).minute(endTimeSplit[1]).toDate(),
      weekdays: geofence.Week.map((w) => w.Week.toString()) as WeekDayId[],
    };
  } else {
    return {
      enabled: false,
      from: moment().startOf("day").toDate(),
      to: moment().endOf("day").toDate(),
      weekdays: ["0", "1", "2", "3", "4", "5", "6"] as WeekDayId[],
    };
  }
};
