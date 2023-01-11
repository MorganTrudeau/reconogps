import axios from "axios";

import { API_URL, PACKAGE_NAME } from "@env";
import { Platform } from "react-native";
import { validateResponseData } from "./utils";

export const login = async (account: string, password: string) => {
  const res = await axios.get(`${API_URL}/Quikloc8/V1/user/Auth2`, {
    params: {
      Account: account,
      Password: password,
      appKey: PACKAGE_NAME,
      deviceType: Platform.select({
        ios: "iOS",
        android: "android",
        web: "browser",
      }),
    },
  });

  validateResponseData(res);

  console.log(res);

  return res.data.Data;
};

export const logout = async (minorToken: string, deviceToken: string) => {
  const res = await axios.get(`${API_URL}/QuikProtect/V1/Client/Logoff`, {
    params: {
      MinorToken: minorToken,
      deviceToken: deviceToken,
      mobileToken: deviceToken,
    },
  });
  validateResponseData(res);
  return res.data;
};

export const refreshToken = async (
  majorToken: string,
  minorToken: string,
  deviceToken: string
) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/User/RefreshToken`, {
    params: {
      MajorToken: majorToken,
      MinorToken: minorToken,
      MobileToken: deviceToken,
      DeviceToken: deviceToken,
    },
  });
  console.log(res);
  validateResponseData(res);
  return res.data.Data;
};

export const getPasswordResetCode = async (email: string) => {
  const res = await axios.get(
    `${API_URL}/QuikProtect/V1/Client/VerifyCodeByEmail`,
    {
      params: { email },
    }
  );
  validateResponseData(res);
  return res.data;
};

export const resetPassword = async (
  account: string,
  checkNum: string,
  newPassword: string
) => {
  const res = await axios.get(
    `${API_URL}/QuikProtect/V1/Client/ForgotPassword`,
    { params: { account, checkNum, newPassword } }
  );
  validateResponseData(res);
  return res.data;
};

export const changePassword = async (
  minorToken: string,
  oldpwd: string,
  newpwd: string
) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/User/Password`, {
    params: { MinorToken: minorToken, oldpwd, newpwd },
  });
  console.log(res);
  validateResponseData(res);
  return res.data;
};
