import axios from "axios";
import { validateResponseData } from "./utils";

export const changeRelayStatus = async (
  MajorToken: string,
  MinorToken: string
) => {
  const res = await axios.get(
    `https://newapi.quiktrak.co/QuikProtect/V1/Client/Balance`,
    {
      params: { MajorToken, MinorToken },
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );

  console.log(res);

  validateResponseData(res);

  return res.data.Data;
};
