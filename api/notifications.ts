import axios from "axios";
import { validateResponseData } from "./utils";

export const loadNotifications = async (
  MinorToken: string,
  deviceToken: string
) => {
  console.log("PARAMS", MinorToken, deviceToken);
  const res = await axios.get(
    "https://newapi.quiktrak.co/Quikloc8/V1/asset/Alarms",
    {
      params: { MinorToken, deviceToken: deviceToken },
    }
  );
  validateResponseData(res);
  console.log(res.data);
  return res.data.Data;
};

export function registerToken(token: string) {}

export function unRegisterToken() {}
