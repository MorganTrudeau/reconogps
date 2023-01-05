import axios from "axios";

import { API_URL, PACKAGE_NAME } from "@env";
import { Platform } from "react-native";

export const login = async (account: string, password: string) => {
  const res = await axios.get(`${API_URL}/Quikloc8/V1/user/Auth2`, {
    params: {
      Account: account,
      Password: password,
      appKey: PACKAGE_NAME,
      deviceToken: "asdf",
      deviceType: Platform.select({
        ios: "iOS",
        android: "android",
        web: "browser",
      }),
    },
  });
  return res.data;
};

export const getPasswordResetCode = async (email: string) => {
  const res = await axios.get(
    `${API_URL}/QuikProtect/V1/Client/VerifyCodeByEmail`,
    {
      params: { email },
    }
  );
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
  return res.data;
};
