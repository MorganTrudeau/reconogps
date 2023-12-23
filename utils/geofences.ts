import moment from "moment";
import { Geofence, WeekDayId } from "../types";
import { GeoTypes } from "./enums";
import { createCircleCoords } from "./maps";

export const makeDefaultGeofence = (): Geofence => {
  return {
    Address: "",
    Alerts: 8,
    Alt: 0,
    BeginDate: null,
    BeginTime: "",
    Code: "",
    ContactList: [],
    Content: "",
    CustomerCode: "",
    CycleType: 0,
    DelayTime: 0,
    EndDate: null,
    EndTime: "",
    GeoPolygon: "",
    GeoType: 1,
    Icon: "",
    InSpeedLimit: 0,
    Inverse: 0,
    Lat: 49.2827,
    Lng: -123.1207,
    Name: "",
    NotifyTypes: 0,
    Radius: 0,
    Relay: 0,
    RelayTime: 0,
    SelectedAssetList: [],
    Share: 0,
    State: 0,
    TimeZone: 0,
    Unit: "MPS",
    Week: [],
  };
};

export const getGeofenceCoords = (geofence: Geofence) => {
  let coords = [];

  if (geofence.GeoType === GeoTypes.CIRCLE) {
    coords = createCircleCoords([geofence.Lng, geofence.Lat], geofence.Radius);
  } else {
    const inputString = geofence.GeoPolygon;

    const pattern =
      /(\w+)\(\(([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)(?:,\s*[-+]?\d+\.\d+\s+[-+]?\d+\.\d+)*\)\)/;
    const match = inputString.match(pattern);

    if (match) {
      const coordPattern = /([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/g;
      let coordMatch;

      while ((coordMatch = coordPattern.exec(match[0])) !== null) {
        coords.push([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
      }
    }
  }

  return coords;
};

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
