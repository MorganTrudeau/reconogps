import axios from "axios";
import Config from "react-native-config";
import {
  API_DOMIAN1,
  API_DOMIAN2,
  formDataFromObject,
  validateResponseData,
} from "./utils";
import { Errors } from "../utils/enums";
import { refreshImageCacheKey } from "../utils";
import { getSpeedValueInKM, initDynamicAssetData } from "../utils/assets";
import { StaticAsset } from "../types";
import { EditAssetParams } from "../types/api";
import queryString from "query-string";

const { API_URL, DEALER_TOKEN } = Config;

export const changeGeolockStatus = async (
  MajorToken: string,
  MinorToken: string,
  assetCode: string,
  state: "on" | "off"
) => {
  const res = await axios.get(`${API_DOMIAN2}asset/GeoLock`, {
    params: { MajorToken, MinorToken, code: assetCode, state },
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  validateResponseData(res);

  return res.data.Data;
};

export const changeRelayStatus = async (
  MajorToken: string,
  MinorToken: string,
  assetCode: string,
  state: "on" | "off"
) => {
  const res = await axios.get(`${API_DOMIAN2}asset/Relay`, {
    params: { MajorToken, MinorToken, code: assetCode, state },
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  validateResponseData(res);

  return res.data.Data;
};

export const loadDynamicAssets = async (
  majorToken: string,
  minorToken: string,
  ids: string[]
) => {
  const codes = ids.join(",");
  var formData = new FormData();
  formData.append("codes", codes);

  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Device/GetPosInfosDB`,
    formData,
    {
      params: { MajorToken: majorToken, MinorToken: minorToken },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  validateResponseData(res);

  return res.data.Data.map(initDynamicAssetData);
};

export const loadStaticAssets = async (
  majorToken: string,
  minorToken: string
) => {
  const res = await axios.get(`${API_URL}/QUIKTRAK/V2/ASSET/GETLIST`, {
    params: { MajorToken: majorToken, MinorToken: minorToken },
  });

  if (!(res.data && res.data.rows && Array.isArray(res.data.rows))) {
    throw Errors.InvalidData;
  }

  return res.data.rows;
};

export const loadAssetAlarms = async (
  solutionType: string,
  productName: string
): Promise<{ Email: string[]; Push: string[] }> => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/QuikTrak/V1/User/GetAlarmOptionsBySolution`,
    {
      params: { SolutionCode: solutionType, ProductName: productName },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetSSP = async (imei: string, productCode: string) => {
  const formData = new FormData();

  formData.append("DealerToken", DEALER_TOKEN);
  formData.append("IMEI", imei);
  formData.append("ProductCode", productCode);

  const res = await axios.post(
    `https://newapi.quiktrak.co/Common/v1/Activation/SSP`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetInfo = async (majorToken: string, imeis: string[]) => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/Common/v1/Activation/GetAssetsInfo`,
    { params: { majortoken: majorToken, imeis: imeis.join(",") } }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetActivationInfo = async (
  majorToken: string,
  imei: string
) => {
  const assetInfo = await loadAssetInfo(majorToken, [imei]);

  const asset = assetInfo.Assets[0];
  const productCode = asset.ProductCode;

  return loadAssetSSP(imei, productCode);
};

export const uploadAssetImage = async (imei: string, base64: string) => {
  const res = await axios.post(
    "https://upload.quiktrak.co/image/Upload",
    queryString.stringify({
      data: `data:image/jpeg;base64,${base64}`,
      id: `IMEI_${imei}`,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }
  );

  validateResponseData(res);

  refreshImageCacheKey();

  return res.data.Data;
};

export const editAsset = async (
  majorToken: string,
  minorToken: string,
  asset: StaticAsset
) => {
  const params: EditAssetParams = {
    MajorToken: majorToken,
    MinorToken: minorToken,
    Code: asset.id,
    IMEI: asset.imei,
    name: asset.name,
    registration: asset.registration,
    speedUnit: asset.speedUnit,
    initMileage: asset.initialMileage,
    initAccHours: asset.initialAccHours,
    attr1: asset.make,
    attr2: asset.model,
    attr3: asset.color,
    attr4: asset.year,
    MaxSpeed: asset.maxSpeed,
    AssetType: asset.assetType,
    DriverCode: asset.driverCode,
    RoadSpeed: asset.roadSpeed ? 1 : 0,
    LBSWIFI: asset.onWifi ? 1 : 0,
    STATICDRIFT: asset.onStaticDrift ? 1 : 0,
    Input1Name: asset.input1,
    Input2Name: asset.input2,
  };

  if (params.MaxSpeed) {
    params.MaxSpeed = getSpeedValueInKM(params.speedUnit, params.MaxSpeed);
  }
  if (params.DriverCode === "000000") {
    params.DriverCode = "";
  }
  const formData = formDataFromObject(params);
  const res = await axios.post(`${API_DOMIAN1}Device/Edit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  validateResponseData(res);
  if (res.data.Data.Device) {
    return res.data.Data.Device as string[];
  } else {
    throw "missing device";
  }
};
