import moment from "moment";
import { PlaybackEvent, PlaybackPoint } from "../types";
import { Constants, EventIcons } from "./constants";
import { generateUid } from ".";

export const parsePlaybackHistory = (data: any[][]) => {
  let newArry: PlaybackPoint[] = [];
  if (data && data.length) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (
        data[i - 1] ||
        JSON.stringify(data[i]) !== JSON.stringify(data[i - 1])
      ) {
        let index = 0;
        let point: PlaybackPoint = {
          object: "playback-point",
          id: generateUid(),
          positionTime: data[i][index++] * 1000,
          lat: data[i][index++],
          lng: data[i][index++],
          direct: data[i][index++],
          speed: data[i][index++],
          timeSpan: data[i][index++],
          mileage: data[i][index++],
          alerts: data[i][index++],
          status: data[i][index++],
        };
        newArry.push(point);
      }
    }
    newArry = newArry.reverse();
  }
  return newArry;
};

export const parsePlaybackEvents = (data: any[][]) => {
  let newArry: PlaybackEvent[] = [];
  if (data && data.length) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (
        !data[i - 1] ||
        JSON.stringify(data[i]) !== JSON.stringify(data[i - 1])
      ) {
        let index = 0;
        let event: PlaybackEvent = {
          object: "playback-event",
          id: generateUid(),
          assetID: data[i][index++],
          eventClass: data[i][index++],
          eventType: data[i][index++],
          state: data[i][index++],
          otherCode: data[i][index++],
          otherCode2: data[i][index++],
          contactCode: data[i][index++],
          beginTime: data[i][index++],
          endTime: data[i][index++],
          positionType: data[i][index++],
          lat: data[i][index++],
          lng: data[i][index++],
          alt: data[i][index++],
          alerts: data[i][index++],
          status: data[i][index++],
          content: data[i][index++],
          positionTime: moment.utc(data[i][7]).valueOf(),
        };

        newArry.push(event);
      }
    }
    newArry = newArry.reverse();
  }
  return newArry;
};

export const combinePlaybackPointsAndEvents = (
  points: PlaybackPoint[],
  events: PlaybackEvent[]
) => {
  return [...points, ...events].sort((a, b) => b.positionTime - a.positionTime);
};

// general: require("../assets/markers/pin-activity.png"),
// accOff: require("../assets/markers/pin-acc-off.png"),
// accOn: require("../assets/markers/pin-acc-on.png"),
// geoIn: require("../assets/markers/pin-geo-in.png"),
// geoOut: require("../assets/markers/pin-geo-out.png"),

export const getEventInfo = (event: PlaybackEvent | PlaybackPoint) => {
  let info: { icon: keyof typeof EventIcons; title: string } = {
    icon: "general",
    title: "Update",
  };

  if (event.object === "playback-point") {
    // @ts-ignore
    if ((event.status == 2097225) & (1 > 0)) {
      info.icon = "accOn";
      info.title = "Ignition On";
    } else {
      info.icon = "accOff";
      info.title = "Ignition Off";
    }

    return info;
  }

  if (event.object === "playback-event") {
    switch (event.eventClass) {
      case 1:
        switch (event.eventType) {
          case 8:
            info.icon = "geoIn";
            info.title = "Geofence Entered";
            break;
          case 16:
            info.icon = "geoOut";
            info.title = "Geofence Exited";
            break;
          default:
            Object.values(Constants.POSITION_ALERTS).forEach((alert) => {
              if (alert.id === event.eventType) {
                info.title = alert.name;
              }
            });
        }
        break;
      case 2:
        if (event.eventType === 0) {
          //point.IconBg = 'bg-color-gray';
          info.title = "Ignition Off";
          info.icon = "accOff";
        } else {
          //point.IconBg = 'bg-color-green';
          info.title = "Ignition On";
          info.icon = "accOn";
        }
        break;
      case 4:
        if (event.eventType === 0) {
          info.icon = "stopped";
          info.title = "Stopped";
        } else {
          //point.IconBg = 'bg-color-green';
          info.icon = "moving";
          info.title = "Moving";
        }
        break;
    }
  }

  return info;
};
