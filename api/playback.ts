import axios from "axios";
import { PlaybackPoint } from "../types";
import { validateResponseData } from "./utils";

export const loadPlayback = async (
  MinorToken: string,
  Code: string,
  From: string,
  To: string,
  IsIgnore: boolean
) => {
  const res = await axios.get(
    `https://newapi.quiktrak.co/QuikTrak/V1/Device/GetHisPosArray2?`,
    { params: { MinorToken, Code, From, To, IsIgnore } }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const optimizePlaybackHistory = async (
  playbackHistory: PlaybackPoint[]
) => {
  let rawArray: any[] = [];

  playbackHistory.forEach((point) => {
    rawArray.push([
      null,
      null,
      null,
      new Date(point.positionTime * 1000),
      null,
      null,
      null,
      null,
      null,
      null,
      point.lat, //lat
      point.lng, // lng
      null,
      point.direct, //direct
      point.speed, //speed
      point.mileage, //mileage
    ]);
  });

  const res = await axios.post(
    `https://osrm.sinopacific.com.ua/playback/v2`,
    JSON.stringify(rawArray),
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
};

export const getTripReport = async (data: {
  MajorToken: string;
  MinorToken: string;
  DateFrom: string;
  DateTo: string;
  Imeis: string[];
}) => {
  const res = await axios.post(
    `https://newapi.quiktrak.co/QuikTrak/V1/Report/GetTripReport`,
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } }
  );

  validateResponseData(res);

  return res.data;
};
