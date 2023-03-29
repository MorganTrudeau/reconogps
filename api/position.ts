import axios from "axios";
import { GEOCODE_API_URL, GEOCODE_API_URL2 } from "@env";
import { validateResponseData } from "./utils";
import { initDynamicAssetData } from "../utils/assets";

export const geocodeLatLong = async (lat: number, lon: number) => {
  let res;

  try {
    res = await axios.get(`${GEOCODE_API_URL}/reverse.php`, {
      params: { lat, lon, format: "json", zoon: "18", addressdetails: "1" },
    });
  } catch (error) {
    res = await axios.get(`${GEOCODE_API_URL2}/reverse`, {
      params: { lat, lon, format: "json", zoon: "18", addressdetails: "1" },
    });
  }

  //   const res = await axios.get(
  //     `${GEOCODE_API_URL2}/reverse?format=json&zoom=18&addressdetails=1&lat=${lat}&lon=${lon}`
  //   );

  //   const res = await axios.get(`${GEOCODE_API_URL2}/reverse`, {
  //     params: { lat, lon, format: "json", zoon: "18", addressdetails: "1" },
  //   });

  console.log(res);

  if (!(res.data && res.data.display_name)) {
    return `Lat: ${lat}, Lng: ${lon},`;
  } else {
    return res.data.display_name;
  }
};

export const geocodeAddress = async (address: string) => {
  const res = await axios.get(`${GEOCODE_API_URL2}/search`, {
    params: { format: "json", polygon: 1, addressdetails: 1, q: address },
  });

  console.log(res);

  validateResponseData(res);

  return res.data.Data.map(initDynamicAssetData);
};
