import axios from "axios";
import { API_URL } from "@env";
import { buildFormData, validateResponseData } from "./utils";
import { AlarmReportParams } from "../types/api";

export const getReportAlarms = async (
  majorToken: string,
  minorToken: string
) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/Report/GetAlertList`, {
    params: { MajorToken: majorToken, MinorToken: minorToken },
  });

  validateResponseData(res);

  return res.data.Data;
};

export const createAlarmReport = async (data: AlarmReportParams) => {
  const formData = buildFormData(data);

  console.log(formData);

  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Report/GetAlertReportData`,
    {},
    { params: data }
  );

  console.log(res);

  validateResponseData(res);

  return res.data.Data;
};
