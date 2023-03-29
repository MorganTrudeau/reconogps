import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { Errors } from "../utils/enums";
import { initDynamicAssetData } from "../utils/assets";

export const loadDynamicAssets = async (
  majorToken: string,
  minorToken: string,
  ids: string[]
) => {
  const codes = ids.join(",");
  var formData = new FormData();
  formData.append("codes", codes);

  console.log(API_URL, codes, majorToken, minorToken);

  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Device/GetPosInfosDB`,
    formData,
    {
      params: { MajorToken: majorToken, MinorToken: minorToken },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  console.log("RES", res);

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

  console.log(res);

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
