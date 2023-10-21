import * as functions from "firebase-functions";
import { validateResponseData } from "../utils";
import axios from "axios";
import { getAuthSession } from "./AuthSession";

const FormData = require("form-data");

const {
  account: { dealer_token },
} = functions.config();

export const loadAssetSSP = async (imei: string, productCode: string) => {
  const formData = new FormData();

  formData.append("DealerToken", dealer_token);
  formData.append("IMEI", imei);
  formData.append("ProductCode", productCode);

  const res = await axios.post(
    `https://newapi.quiktrak.co/Common/v1/Activation/SSP`,
    { DealerToken: dealer_token, IMEI: imei, ProductCode: productCode },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }
  );

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetInfo = async (majorToken: string, imeis: string[]) => {
  const res = await axios.get(
    `https://testapi.quiktrak.co/Common/v1/Activation/GetAssetsInfo`,
    { params: { majortoken: majorToken, imeis: imeis.join(",") } }
  );

  if (res.data.MajorCode === "100") {
    throw new functions.https.HttpsError(
      "not-found",
      "The provided IMEI is invalid."
    );
  }

  validateResponseData(res);

  return res.data.Data;
};

export const loadAssetActivationInfo = functions.https.onCall(
  async ({ majorToken, imei }) => {
    const { MajorToken } = await getAuthSession().getSession();

    const assetInfo = await loadAssetInfo(MajorToken, [imei]);

    const asset = assetInfo.Assets[0];
    const productCode = asset.ProductCode;

    const ssp = await loadAssetSSP(imei, productCode);

    return { asset, ssp };
  }
);
