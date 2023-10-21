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

export const IconSet = {
  asset: "car",
  geofences: "texture-box",
  time: "clock-time-four",
  speedSlow: "speedometer-slow",
  speedFast: "speedometer",
  voltage: "lightning-bolt",
  dateFrom: "calendar-start",
  dateTo: "calendar-end",
  mileage: "road-variant",
  engineHours: "engine",
  battery: "battery-charging",
  timeStopped: "pause-octagon",
  location: "map-marker-radius",
  doorLock: "car-door-lock",
  immobilize: "lock",
  averageSpeed: "speedometer-medium",
  maxSpeed: "speedometer",
  fuel: "gas-station",
  color: "invert-colors",
} as const;

export const SolutionTypes = {
  loc8: "Loc8",
  protect: "Protect",
  track: "Track",
  watch: "Watch",
  life: "Life",
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
