import { validateResponseData } from "./utils";
import axios from "axios";
import { API_URL } from "@env";
import { Errors } from "../utils/enums";
import { Geofence } from "../types";
import { EditGeofenceParams } from "../types/api";
import queryString from "query-string";

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

  validateResponseData(res);

  if (!(res.data.Data && typeof res.data.Data === "object")) {
    throw Errors.InvalidData;
  }

  return Object.values(res.data.Data);
};

export const addGeofence = async (data: EditGeofenceParams) => {
  const res = await axios.post(
    "https://testapi.quiktrak.co/QuikTrak/V1/Device/FenceAdd",
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

export const editGeofence = async (data: EditGeofenceParams) => {
  const res = await axios.post(
    "https://testapi.quiktrak.co/QuikTrak/V1/Device/FenceEdit",
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

export const deleteGeofence = async (data: {
  MajorToken: string;
  MinorToken: string;
  Code: string;
}) => {
  const res = await axios.post(
    "https://newapi.quiktrak.co/QuikTrak/V1/Device/FenceDelete",
    queryString.stringify(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("RES", res.data);

  validateResponseData(res);

  return res.data.Data;
};
