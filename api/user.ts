import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { User } from "../types";

export const updateUserInfo = async (
  majorToken: string,
  minorToken: string,
  update: Partial<User>
) => {
  const res = await axios.get(`${API_URL}/QuikProtect/V1/Client/AccountEdit`, {
    params: { MajorToken: majorToken, MinorToken: minorToken, ...update },
  });

  console.log(res);

  validateResponseData(res);

  return res.data.Data;
};
