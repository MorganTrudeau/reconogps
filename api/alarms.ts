import axios from "axios";
import { validateResponseData } from "./utils";

export const getAlarmSettings = async (
  MajorToken: string,
  MinorToken: string,
  IMEI: string
) => {
  const res = await axios.post(
    `https://testapi.quiktrak.co/QuikTrak/V1/Device/GetAlertConfigure1`,
    undefined,
    {
      params: { MajorToken, MinorToken, IMEI },
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  console.log("Available alarms:", res.data);

  validateResponseData(res);

  return res.data.Data;
};

export const getAvailableAlarms = async (
  SolutionCode: string,
  ProductName: string
) => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/QuikTrak/V1/User/GetAlarmOptionsBySolution`,
    {
      params: { SolutionCode, ProductName },
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  console.log("Alarms settings:", res.data);

  validateResponseData(res);

  return res.data.Data;
};
