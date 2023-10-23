import axios from "axios";
import { validateResponseData } from "./utils";
import { AlarmSettings, AlarmUserConfiguration } from "../types";

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

export const setAlarmSetting = async () => {
  const res = await axios.post(
    `https://newapi.quiktrak.co/QuikTrak/V1/Device/AlertConfigureEdit`,
    {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  // console.log("Alarms settings:", res.data);

  validateResponseData(res);

  return res.data.Data;
};
