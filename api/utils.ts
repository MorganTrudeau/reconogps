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

export const buildFormData = (object: Object) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((arrayVal) => formData.append(`${key}[]`, arrayVal));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
