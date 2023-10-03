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
