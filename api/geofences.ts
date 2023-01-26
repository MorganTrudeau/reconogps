import { validateResponseData } from "./utils";
import axios from "axios";
import { API_URL } from "@env";
import { Errors } from "../utils/enums";
import { Geofence } from "../types";

export const loadGeofences = async (
  majorToken: string,
  minorToken: string
): Promise<Geofence[]> => {
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Device/GetFenceList`,
    {
      MajorToken: majorToken,
      MinorToken: minorToken,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log(res);

  validateResponseData(res);

  if (!(res.data.Data && typeof res.data.Data === "object")) {
    throw Errors.InvalidData;
  }

  return Object.values(res.data.Data);
};
