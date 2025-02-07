import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { loadNotifications } from "../redux/thunks/notifications";
import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  Platform,
} from "react-native";

const NotificationsManager = () => {
  const { minorToken, majorToken, deviceToken } = useAppSelector((state) => ({
    minorToken: state.auth.minorToken,
    majorToken: state.auth.majorToken,
    deviceToken: state.notifications.deviceToken,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    let appStateSubscription: NativeEventSubscription | undefined;

    if (minorToken && majorToken && deviceToken) {
      dispatch(loadNotifications());

      let appState = AppState.currentState;
      const handleStateChange = async (state: AppStateStatus) => {
        if (appState !== state && state === "active") {
          dispatch(loadNotifications());
        }
        appState = state;
      };

      appStateSubscription = AppState.addEventListener(
        Platform.select({ default: "change", android: "focus" }),
        handleStateChange
      );
    }

    return () => {
      appStateSubscription && appStateSubscription.remove();
    };
  }, [minorToken, majorToken, deviceToken]);

  return null;
};

export default NotificationsManager;
