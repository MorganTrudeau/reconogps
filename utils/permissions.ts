import {
  getForegroundPermissionsAsync,
  LocationPermissionResponse,
} from "expo-location";
import { Platform } from "react-native";

export const checkLocationPermission =
  async (): Promise<LocationPermissionResponse> => {
    let res;
    if (Platform.OS === "web") {
      if (
        !(navigator && navigator.permissions && navigator.permissions.query)
      ) {
        throw "navigator.permissions.query missing";
      }
      const webStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      res = {
        granted:
          // @ts-ignore old web versions use status
          webStatus.state === "granted" || webStatus.status === "granted",
        canAskAgain:
          // @ts-ignore old web versions use status
          webStatus.state === "prompt" || webStatus.status === "prompt",
      } as LocationPermissionResponse;
    } else {
      res = await getForegroundPermissionsAsync();
    }
    return res;
  };
