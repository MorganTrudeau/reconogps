export const validateResponseData = (res: any) => {
  if (
    !(
      res &&
      res.data &&
      res.data.MajorCode === "000" &&
      (res.data.MinorCode === "0000" || res.data.MinorCode === "000")
    )
  ) {
    throw res?.data?.Data || "invalid_data";
  }
};

export const API_DOMIAN1 = "https://newapi.quiktrak.co/QuikTrak/V1/";
export const API_DOMIAN2 = "https://newapi.quiktrak.co/Quikloc8/V1/";
export const API_DOMIAN3 = "https://newapi.quiktrak.co/QuikProtect/V1/Client/";

export const formDataFromObject = (object: { [key: string]: any }) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, val]) => {
    formData.append(key as string, val);
  });
  return formData;
};
