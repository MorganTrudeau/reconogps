import axios from "axios";

import { API_URL, PACKAGE_NAME } from "@env";
import { Platform } from "react-native";
import { validateResponseData } from "./utils";

export const login = async (
  account: string,
  password: string,
  mobileToken: string
) => {
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
      deviceToken: mobileToken,
      mobileToken: mobileToken,
    },
  });

  validateResponseData(res);

  return { account, password, data: res.data.Data, mobileToken };
};

export const logout = async (
  minorToken: string,
  mobileToken?: string | null
) => {
  console.log("START");
  try {
    const res = await axios.get(`${API_URL}/QuikProtect/V1/Client/Logoff`, {
      params: {
        MinorToken: minorToken,
        deviceToken: mobileToken,
        mobileToken: mobileToken,
      },
    });
    console.log("Logout res", res);
    validateResponseData(res);
    return res.data;
  } catch (error) {
    console.log("Logout error", error);
    throw error;
  }
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
  validateResponseData(res);
  return res.data;
};
