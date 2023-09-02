import { User } from "../types";
import { timeZones } from "./data";

export const getTimeZone = (timeZoneId: string | null | undefined) => {
  if (!timeZoneId) {
    return undefined;
  }
  return timeZones.find((t) => t.value === timeZoneId);
};

export const getTimeZoneId = (timeZoneValue: string): string | undefined => {
  return timeZoneValue.split("_")[1];
};

export const constructTimeZoneId = (
  userTimeZone: User["TimeZone"],
  userTimeZoneId: User["TimeZoneID"]
) => {
  return `${userTimeZone}_${userTimeZoneId}`;
};

export const userFromUpdateApiResponse = (
  userResponse: Omit<User, "TimeZone"> & { TimeZone: string }
): User => {
  const splitTimeZone = userResponse.TimeZone.split("_");

  const timeZone = Number(splitTimeZone[0]);
  const timeZoneId = splitTimeZone[1];

  return { ...userResponse, TimeZone: timeZone, TimeZoneID: timeZoneId };
};

export const userHasAllPermissions = (user: User): boolean =>
  user.Role == 1 ||
  user.Role == 2 ||
  user.Role == 3 ||
  user.Role == 4 ||
  user.Role == 8
    ? true
    : false;
