import { MaterialIcon } from "../types/styles";

export const CustomerTypes = {
  Agent: 2,
  Enterprise: 4,
  Personal: 5,
  Dealer: 6,
  Master: 7,
  ProtectEnterprise: 8,
} as const;

export const PermissionValues = {
  AutoMonthlyReport: 64,
};

export const Errors = {
  InvalidAuth: "invalid_auth",
};

export const IconSet: { asset: MaterialIcon } = {
  asset: "car",
};
