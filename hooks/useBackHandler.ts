import { useEffect, useRef } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export const useBackHandler = (
  onBackPress: () => boolean | null | undefined,
  disabled?: boolean
) => {
  const isDisabled = useRef(disabled);
  isDisabled.current = disabled;

  const handleBackPress = () => {
    if (isDisabled.current) {
      return false;
    }
    onBackPress();
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      subscription.remove();
    };
  }, []);
};
