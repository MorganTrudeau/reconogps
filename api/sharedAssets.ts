import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { SharedAsset } from "../types";

export const subscribeSharedAsset = async (
  majorToken: string,
  code: string
) => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/BindShareRelation`,
    {},
    {
      params: { MajorToken: majorToken, code },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const unsubscribeSharedAsset = async (
  majorToken: string,
  imei: string
) => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/UnboundShareRelation`,
    {},
    {
      params: { MajorToken: majorToken, imei },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadMySharedAssets = async (
  majorToken: string,
  minorToken: string
): Promise<SharedAsset[]> => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/QuerySharedInfos`,
    {},
    {
      params: { MajorToken: majorToken, MinorToken: minorToken },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadSubscribedAssets = async (
  majorToken: string,
  minorToken: string
): Promise<SharedAsset[]> => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/QueryShareRelations`,
    {},
    {
      params: { MajorToken: majorToken, MinorToken: minorToken },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const startSharingAsset = async (
  majorToken: string,
  imei: string,
  days: string
) => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/StartShare`,
    {},
    {
      params: { MajorToken: majorToken, imei, days },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const stopSharingAsset = async (majorToken: string, imei: string) => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/CloseShare`,
    {},
    {
      params: { MajorToken: majorToken, imei },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const extendSharedAssetExpiry = async (
  majorToken: string,
  code: string,
  days: string
) => {
  const res = await axios.post(
    `${API_URL}/QUIKTRAK/V2/ASSET/EditShare`,
    {},
    {
      params: { MajorToken: majorToken, code, days },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};
