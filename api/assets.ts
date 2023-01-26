import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { Errors } from "../utils/enums";

export const loadDynamicAssets = async (
  majorToken: string,
  minorToken: string,
  ids: string[]
) => {
  const codes = ids.join(",");
  var formData = new FormData();
  formData.append("codes", codes);
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Device/GetPosInfos2`,
    formData,
    { params: { MajorToken: majorToken, MinorToken: minorToken } }
  );

  validateResponseData(res);

  return res.data.Data;
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

  console.log(res);

  validateResponseData(res);

  return res.data.Data;
};
