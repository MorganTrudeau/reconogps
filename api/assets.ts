import axios from "axios";
import { API_URL, DEALER_TOKEN } from "@env";
import { validateResponseData } from "./utils";
import { Errors } from "../utils/enums";
import { initDynamicAssetData } from "../utils/assets";
import { StaticAsset } from "../types";

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

  console.log("loadAssetActivationInfo", res.data);

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetInfo = async (majorToken: string, imeis: string[]) => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/Common/v1/Activation/GetAssetsInfo`,
    { params: { majortoken: majorToken, imeis: imeis.join(",") } }
  );

  console.log("loadAssetInfo", res.data);

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
