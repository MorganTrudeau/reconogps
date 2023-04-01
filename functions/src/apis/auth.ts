import axios from "axios";

import { PACKAGE_NAME, API_URL } from "../constants";

export const login = async (account: string, password: string) => {
  const res = await axios.get(`${API_URL}/Quikloc8/V1/user/Auth2`, {
    params: {
      Account: account,
      Password: password,
      appKey: PACKAGE_NAME,
      deviceType: "browser",
    },
  });

  if (res?.data?.Data && res.data.Data.MajorToken && res.data.Data.MinorToken) {
    return res.data.Data;
  } else {
    throw new Error("invalid_data");
  }
};

export const refreshToken = async (majorToken: string, minorToken: string) => {
  const res = await axios.get(`${API_URL}/QuikTrak/V1/User/RefreshToken`, {
    params: {
      MajorToken: majorToken,
      MinorToken: minorToken,
      MobileToken: "",
      DeviceToken: "",
    },
  });

  return res.data;
};
