import axios from "axios";
import { validateResponseData } from "./utils";
import { AlarmSettings, AlarmUserConfiguration } from "../types";
import queryString from "query-string";

export const getAlarmSettings = async (
  MajorToken: string,
  MinorToken: string,
  IMEI: string
): Promise<AlarmUserConfiguration> => {
  const res = await axios.post(
    `https://testapi.quiktrak.co/QuikTrak/V1/Device/GetAlertConfigure1`,
    undefined,
    {
      params: { MajorToken, MinorToken, IMEI },
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  console.log("User alarm config:", res.data);

  validateResponseData(res);

  return res.data.Data;
};

export const getAvailableAlarms = async (
  SolutionCode: string,
  ProductName: string
): Promise<AlarmSettings> => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/QuikTrak/V1/User/GetAlarmOptionsBySolution`,
    {
      params: { SolutionCode, ProductName },
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  console.log("Alarm settings:", res.data);

  validateResponseData(res);

  return res.data.Data;
};

export const setAlarmSetting = async (data: Object) => {
  console.log(data);

  const res = await axios.post(
    `https://testapi.quiktrak.co/QuikTrak/V1/Device/AlertConfigureEdit1`,
    queryString.stringify(data),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  // console.log("Alarms settings:", res.data);

  validateResponseData(res);

  return res.data.Data;
};
