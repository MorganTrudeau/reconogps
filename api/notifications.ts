import axios from "axios";
import {
  API_DOMIAN1,
  API_DOMIAN2,
  formDataFromObject,
  validateResponseData,
} from "./utils";

export const loadNotifications = async (
  MinorToken: string,
  deviceToken: string
) => {
  const res = await axios.get(`${API_DOMIAN2}asset/Alarms`, {
    params: { MinorToken, deviceToken: deviceToken },
  });
  validateResponseData(res);
  console.log("Load notifications response:", res.data);
  return res.data.Data;
};

export const registerToken = async (
  MajorToken: string,
  MinorToken: string,
  MobileToken: string,
  DeviceToken: string
) => {
  const params = {
    MajorToken,
    MinorToken,
    MobileToken,
    DeviceToken,
  };
  console.log("Register token params:", params);
  const res = await axios.post(
    `${API_DOMIAN1}User/RefreshToken`,
    formDataFromObject(params),
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  console.log("Register token response:", res.data);
  validateResponseData(res);
  return res.data.Data;
};

export function unRegisterToken() {}
