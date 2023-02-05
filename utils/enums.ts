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
  InvalidData: "invalid_data",
};

export const IconSet: {
  asset: MaterialIcon;
  geofences: MaterialIcon;
  time: MaterialIcon;
  speedSlow: MaterialIcon;
  speedFast: MaterialIcon;
  voltage: MaterialIcon;
  location: MaterialIcon;
} = {
  asset: "car",
  geofences: "texture-box",
  time: "clock-time-four",
  speedSlow: "speedometer-slow",
  speedFast: "speedometer",
  voltage: "lightning-bolt",
  location: "map-marker",
};

export const SolutionTypes = {
  loc8: "loc8",
  protect: "protect",
  track: "track",
  watch: "watch",
  life: "life",
} as const;

export const WeekDays = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
} as const;
