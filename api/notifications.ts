import axios from "axios";
import { validateResponseData } from "./utils";

export const loadNotifications = async (MinorToken: string) => {
  const res = await axios.get(
    "https://newapi.quiktrak.co/Quikloc8/V1/asset/Alarms",
    {
      params: { MinorToken, deviceToken: "" },
    }
  );
  validateResponseData(res);
  return res.data.Data;
};
