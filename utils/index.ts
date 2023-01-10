import { StaticAsset } from "../types";
import { IMAGE_URL } from "@env";
import { AlertButton, AlertOptions } from "react-native";

export const constructImageUrl = (image: string) =>
  `${IMAGE_URL}/Attachment/images/${image}?${Date.now()}`;

const errorHasMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

export const errorToMessage = (error: unknown): string => {
  if (errorHasMessage(error)) {
    return error.message;
  } else {
    return "Something went wrong. Please try again.";
  }
};

export const alertGeneralError = (
  Alert: {
    alert: (
      title: string,
      message?: string | undefined,
      buttons?: AlertButton[] | undefined,
      options?: AlertOptions | undefined
    ) => void;
  },
  onConfirm?: () => void
) => {
  Alert.alert(
    "Internal Error",
    "Something went wrong please try again.",
    onConfirm ? [{ text: "OK", onPress: onConfirm }] : undefined
  );
};
