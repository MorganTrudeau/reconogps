import { Alert, AlertButton, AlertOptions, Platform } from "react-native";

export const useAlert = () => {
  const alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => {
    if (Platform.OS === "web") {
      alert(`${title} - ${message}`);
    } else {
      Alert.alert(title, message, buttons, options);
    }
  };

  return { alert };
};
