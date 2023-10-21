import axios from "axios";
import { PlaybackPoint, PlaybackTrip } from "../types";
import { validateResponseData } from "./utils";
import queryString from "query-string";

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
}): Promise<PlaybackTrip[]> => {
  const res = await axios.post(
    "https://newapi.quiktrak.co/QuikTrak/V1/Report/GetTripReport2New",
    // JSON.stringify(data),
    queryString.stringify(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

// let data = {
//   MajorToken: self.$root.MajorToken,
//   MinorToken: self.$root.MinorToken,
//   DateFrom: moment
//     .utc(self.$route.query.from, window.COM_TIMEFORMAT2)
//     .format(window.COM_TIMEFORMAT),
//   DateTo: moment
//     .utc(self.$route.query.to, window.COM_TIMEFORMAT2)
//     .format(window.COM_TIMEFORMAT),
//   Imeis: [self.IMEI],
// };
// //console.log(data);
// self.$app.request.promise
//   .post(API_URL.GET_REPORT_TRIP, data, "json")
//   .then(function (result) {
//     if (result.data.MajorCode === "000") {
//       if (result.data.Data && result.data.Data.length) {
//         self.initSummaryList(
//           result.data.Data[0].Total,
//           result.data.Data[0].Details
//         );
//         self.initTripList(result.data.Data[0].Details);
//       } else {
//         self.initSummaryList();
//         self.initTripList();
//       }
//     } else {
//       self.$app.dialog.alert(
//         LANGUAGE.PROMPT_MSG023 +
//           `<br>MajorCode: ${result.data.MajorCode}<br>MinorCode: ${result.data.MinorCode}<br>${result.data.Data}`
//       );
//     }
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
