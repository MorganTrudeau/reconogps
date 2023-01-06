import axios from "axios";
import { API_URL } from "@env";
import { validateResponseData } from "./utils";

export const loadDynamicAssets = async (
  majorToken: string,
  minorToken: string,
  ids: string[]
) => {
  const codes = ids.join(",");
  var formData = new FormData();
  formData.append("codes", codes);
  const res = await axios.post(
    `${API_URL}/QuikTrak/V1/Device/GetPosInfos2`,
    formData,
    { params: { MajorToken: majorToken, MinorToken: minorToken } }
  );

  validateResponseData(res);

  return res.data.Data;
};
