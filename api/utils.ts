export const validateResponseData = (res: any) => {
  if (
    !(
      res &&
      res.data &&
      res.data.MajorCode === "000" &&
      res.data.MinorCode === "0000"
    )
  ) {
    console.log(res?.data);
    throw res?.data?.Data || "invalid_data";
  }
};

export const API_DOMIAN1 = "https://newapi.quiktrak.co/QuikTrak/V1/";
export const API_DOMIAN2 = "https://newapi.quiktrak.co/Quikloc8/V1/";
export const API_DOMIAN3 = "https://newapi.quiktrak.co/QuikProtect/V1/Client/";
