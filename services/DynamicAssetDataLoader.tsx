import { useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  Platform,
} from "react-native";
import { loadDynamicAssets } from "../redux/thunks/assets";
import { useAppDispatch } from "../hooks/useAppDispatch";

export const DynamicAssetDataLoader = () => {
  const ids = useAppSelector(
    (state) => state.assets.staticData.ids as string[]
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    let appStateSubscription: NativeEventSubscription | undefined;
    let interval: NodeJS.Timeout;

    if (ids.length) {
      const initInterval = () => {
        dispatch(loadDynamicAssets({ ids }));
        interval = setInterval(
          () => dispatch(loadDynamicAssets({ ids })),
          30 * 1000
        );
      };

      let appState = AppState.currentState;

      if (appState === "active") {
        initInterval();
      }

      const handleStateChange = async (state: AppStateStatus) => {
        if (appState !== state) {
          if (state === "active") {
            initInterval();
          } else {
            clearInterval(interval);
          }
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
      clearInterval(interval);
    };
  }, [ids]);

  return null;
};
