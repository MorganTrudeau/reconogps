import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";
import { Permissions2, User } from "../types";
import { userFromUpdateApiResponse } from "../utils/user";

export const updateUserInfo = async (
  majorToken: string,
  minorToken: string,
  update: Partial<User>,
  permissions2: Permissions2
) => {
  const params = {
    MajorToken: majorToken,
    MinorToken: minorToken,
    ...update,
    ...permissions2,
  };

  const res = await axios.get(`${API_URL}/QuikProtect/V1/Client/AccountEdit`, {
    params,
  });

  validateResponseData(res);

  return { user: userFromUpdateApiResponse(res.data.Data), permissions2 };
};
