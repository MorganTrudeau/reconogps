import { StaticAsset } from "../types";
import { IMAGE_URL } from "@env";

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