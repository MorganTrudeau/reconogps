import axios from "axios";
import { API_DOMIAN3, validateResponseData } from "./utils";

export const changeRelayStatus = async (
  MajorToken: string,
  MinorToken: string
) => {
  const res = await axios.get(`${API_DOMIAN3}Balance`, {
    params: { MajorToken, MinorToken },
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  validateResponseData(res);

  return res.data.Data;
};
