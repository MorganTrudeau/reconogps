export const validateResponseData = (res: any) => {
  if (
    !(
      res &&
      res.data &&
      res.data.MajorCode === "000" &&
      res.data.MinorCode === "0000"
    )
  ) {
    throw res?.data?.Data || "invalid_data";
  }
};
