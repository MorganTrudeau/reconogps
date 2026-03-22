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
  const res = await axios.post(
    `${API_DOMIAN1}User/RefreshToken`,
    formDataFromObject(params),
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  validateResponseData(res);
  return res.data.Data;
};

export function unRegisterToken() {}
