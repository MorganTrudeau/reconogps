import * as Location from "expo-location";
import { useAlert } from "./useAlert";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { checkLocationPermission } from "../utils/permissions";
import { LatLng } from "../types";
import { errorHasCode } from "../utils";
import { Translations } from "../utils/translations";

export const usePosition = (
  { shouldAskPermission }: { shouldAskPermission?: boolean } = {
    shouldAskPermission: true,
  }
) => {
  const Alert = useAlert();

  const watchSubscription = useRef<Location.LocationSubscription>();

  const [findingLocation, setFindingLocation] = useState(false);

  useEffect(() => {
    return () => {
      watchSubscription.current && watchSubscription.current.remove();
    };
  }, []);

  const checkPermission = async () => {
    try {
      let res = await checkLocationPermission();
      return res;
    } catch (error) {
      console.log("Check permission error", error);
    }
  };

  const askPermission = async () => {
    try {
      let res = await Location.requestForegroundPermissionsAsync();
      return res;
    } catch (error) {
      console.log("Ask permission error", error);
    }
  };

  const handlePermissions = async () => {
    let res;

    if (!shouldAskPermission) {
      res = await checkPermission();
    } else {
      res = await askPermission();
    }

    return res && res.granted;
  };

  const watchLocation = async (
    callback: (data: { position: LatLng }) => void,
    onError: (error: unknown) => void
  ) => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
    }

    const hasPermission = await handlePermissions();

    if (hasPermission) {
      try {
        watchSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 50,
            timeInterval: 10000,
          },
          async (snapshot: Location.LocationObject) => {
            try {
              const { coords } = snapshot;
              callback({ position: coords });
            } catch (error) {
              onError(error);
              return handleErrors(error);
            }
          }
        );
      } catch (error) {
        onError(error);
        return handleErrors(error);
      }
    } else {
      onError("missing-permission");
      return handlePermissionError();
    }
  };

  const getLocation = async (): Promise<{
    position: { latitude: number; longitude: number };
  } | null> => {
    const hasPermission = await handlePermissions();

    if (hasPermission) {
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const { coords } = position;

        try {
          return { position: coords };
        } catch (error) {
          console.log("Geocoder error", error);
          return onFailedLocationRequest();
        }
      } catch (error) {
        return handleErrors(error);
      }
    } else {
      return handlePermissionError();
    }
  };

  const handleErrors = (error: unknown): null => {
    console.log("Location error", error);

    if (!errorHasCode(error)) {
      return onFailedLocationRequest();
    }

    if (Platform.OS === "ios") {
      switch (error.code) {
        case 1:
          return handlePermissionError();
        case 2:
          return onFailedLocationRequest();
        case 3:
          return onFailedLocationRequest();
        default:
          return onFailedLocationRequest();
      }
    } else {
      if (error.code === 5) {
        return handleLocationDisabledError();
      } else {
        return onFailedLocationRequest();
      }
    }
  };

  const handleLocationDisabledError = () => {
    Alert.alert(
      Translations.location.location_disabled_error_title,
      Translations.location.location_disabled_error_message
    );
    setFindingLocation(false);
    return null;
  };

  const handlePermissionError = () => {
    Alert.alert(
      Translations.location.location_permission_error_title,
      Translations.location.location_permission_error_message
    );
    setFindingLocation(false);
    return null;
  };

  const onFailedLocationRequest = () => {
    Alert.alert(
      Translations.location.location_not_found_error_title,
      Translations.location.location_not_found_error_message
    );
    setFindingLocation(false);
    return null;
  };

  return { getLocation, findingLocation, watchLocation };
};
